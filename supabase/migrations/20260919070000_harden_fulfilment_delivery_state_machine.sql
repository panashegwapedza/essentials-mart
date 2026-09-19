-- Tighten fulfilment -> handoff -> delivery state transitions.
--
-- Item outcomes (picked, partial, unavailable, substituted) are considered
-- resolved once no fulfilment item remains pending. The fulfilment itself then
-- becomes ready. Handoff is a separate transition and delivery completion is
-- authoritative for the final delivered outcome.

create or replace function public.complete_order_fulfilment(p_order_id uuid,p_hand_off boolean default false)
returns public.order_fulfilments
language plpgsql security definer set search_path='public','pg_catalog' as $$
declare
  v_f public.order_fulfilments%rowtype;
  v_pending integer;
begin
  select * into v_f
  from public.order_fulfilments
  where order_id=p_order_id
  for update;

  if v_f.id is null then raise exception 'Fulfilment not found'; end if;

  if not private.has_store_role(
    v_f.store_id,
    array['store_operator','fulfilment_operator','store_manager','enterprise_admin']::public.store_staff_role[]
  ) then
    raise exception 'Store fulfilment access denied';
  end if;

  select count(*)
  into v_pending
  from public.order_fulfilment_items
  where fulfilment_id=v_f.id
    and status='pending';

  if v_pending > 0 then
    raise exception 'All fulfilment items must be resolved';
  end if;

  if p_hand_off then
    if v_f.status not in ('ready','partial') then
      raise exception 'Fulfilment must be ready before handoff';
    end if;

    update public.order_fulfilments
    set status='handed_off',
        handed_off_at=coalesce(handed_off_at,now()),
        updated_at=now()
    where id=v_f.id
    returning * into v_f;

    -- Handoff prepares the delivery lifecycle; it does not mark the order
    -- fulfilled. Delivered is a separate authoritative transition.
    perform public.update_delivery_status(
      p_order_id,
      case
        when (select method from public.deliveries where order_id=p_order_id)='pickup'
          then 'ready_for_pickup'
        else 'out_for_delivery'
      end,
      null
    );
  else
    if v_f.status='handed_off' then
      raise exception 'Fulfilment has already been handed off';
    end if;

    update public.order_fulfilments
    set status='ready',
        completed_at=coalesce(completed_at,now()),
        updated_at=now()
    where id=v_f.id
    returning * into v_f;
  end if;

  return v_f;
end;
$$;

-- Delivery movement to an active delivery state requires the fulfilment to
-- have been explicitly handed off. Delivered remains the final transition.
create or replace function public.update_delivery_status(
  p_order_id uuid,
  p_status text,
  p_tracking_reference text default null
)
returns public.deliveries
language plpgsql security definer set search_path='public' as $$
declare
  v_delivery public.deliveries%rowtype;
  v_from text;
  v_order public.orders%rowtype;
  v_f public.order_fulfilments%rowtype;
  v_n uuid;
begin
  if p_status not in ('pending','preparing','ready_for_pickup','out_for_delivery','delivered','failed','cancelled') then
    raise exception 'Invalid delivery status';
  end if;

  select * into v_order
  from public.orders
  where id=p_order_id
  for update;

  select * into v_delivery
  from public.deliveries
  where order_id=p_order_id
  for update;

  select * into v_f
  from public.order_fulfilments
  where order_id=p_order_id
  for update;

  if v_order.id is null or v_delivery.id is null then
    raise exception 'Order or delivery not found';
  end if;

  if not private.has_store_role(
    v_order.store_id,
    array['store_operator','fulfilment_operator','store_manager','enterprise_admin']::public.store_staff_role[]
  ) then
    raise exception 'Store operations access denied';
  end if;

  if v_delivery.status=p_status then return v_delivery; end if;

  if p_status in ('preparing','ready_for_pickup','out_for_delivery','delivered')
     and v_order.status not in ('paid','fulfilling') then
    raise exception 'Order must be paid before fulfilment begins';
  end if;

  if p_status in ('ready_for_pickup','out_for_delivery','delivered')
     and v_f.status <> 'handed_off' then
    raise exception 'Fulfilment must be handed off before delivery can advance';
  end if;

  if p_status='delivered' and v_delivery.status not in ('ready_for_pickup','out_for_delivery') then
    raise exception 'Delivery must be in an active handoff state before delivered';
  end if;

  if v_delivery.method='pickup' and p_status='out_for_delivery' then
    raise exception 'Pickup delivery cannot go out for delivery';
  end if;

  if v_delivery.method<>'pickup' and p_status='ready_for_pickup' then
    raise exception 'Non-pickup delivery cannot become ready for pickup';
  end if;

  v_from:=v_delivery.status;

  update public.deliveries
  set status=p_status,
      tracking_reference=coalesce(p_tracking_reference,tracking_reference),
      delivered_at=case
        when p_status='delivered' then coalesce(delivered_at,now())
        else delivered_at
      end,
      updated_at=now()
  where id=v_delivery.id
  returning * into v_delivery;

  insert into public.delivery_status_history(
    delivery_id,order_id,customer_id,from_status,to_status,tracking_reference,changed_at
  )
  values(
    v_delivery.id,v_delivery.order_id,v_delivery.customer_id,
    v_from,p_status,v_delivery.tracking_reference,now()
  );

  if p_status='delivered'
     and v_order.status not in ('cancelled','refunded','fulfilled') then
    update public.orders
    set status='fulfilled',updated_at=now()
    where id=p_order_id;
  end if;

  insert into public.notifications(
    customer_id,type,title,body,aggregate_type,aggregate_id,action_type,action_target,dedupe_key
  )
  values(
    v_delivery.customer_id,
    'delivery.status_changed',
    'Delivery status updated',
    'Your delivery is now '||replace(p_status,'_',' ')||'.',
    'order',v_delivery.order_id,
    'open_order','/orders/'||v_delivery.order_id,
    'delivery.status:'||v_delivery.order_id||':'||p_status
  )
  on conflict do nothing
  returning id into v_n;

  if v_n is not null then
    insert into public.notification_deliveries(notification_id,channel,status,next_attempt_at)
    values(v_n,'in_app','sent',now())
    on conflict(notification_id,channel) do nothing;

    insert into public.notification_deliveries(notification_id,channel,status,next_attempt_at)
    values(v_n,'push','pending',now())
    on conflict(notification_id,channel) do nothing;

    insert into public.notification_deliveries(notification_id,channel,status,next_attempt_at)
    values(v_n,'whatsapp','pending',now())
    on conflict(notification_id,channel) do nothing;
  end if;

  return v_delivery;
end;
$$;

revoke execute on function public.complete_order_fulfilment(uuid,boolean) from public,anon,authenticated;
grant execute on function public.complete_order_fulfilment(uuid,boolean) to authenticated;

revoke execute on function public.update_delivery_status(uuid,text,text) from public,anon;
grant execute on function public.update_delivery_status(uuid,text,text) to authenticated;
