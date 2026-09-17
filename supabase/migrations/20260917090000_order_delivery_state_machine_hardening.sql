create or replace function public.enforce_order_status_transition()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if new.status = old.status then return new; end if;
  if old.status in ('placed','pending') and new.status in ('confirmed','cancelled') then return new; end if;
  if old.status = 'confirmed' and new.status in ('paid','cancelled') then return new; end if;
  if old.status = 'paid' and new.status in ('fulfilling','cancelled','refunded') then return new; end if;
  if old.status = 'fulfilling' and new.status in ('fulfilled','cancelled') then return new; end if;
  if old.status = 'fulfilled' and new.status = 'refunded' then return new; end if;
  raise exception 'Invalid order transition: % -> %', old.status, new.status;
end;
$$;

drop trigger if exists trg_orders_status_transition on public.orders;
create trigger trg_orders_status_transition before update of status on public.orders for each row execute function public.enforce_order_status_transition();

create or replace function public.update_order_status(p_order_id uuid, p_status text)
returns public.orders language plpgsql security definer set search_path = public as $$
declare v_order public.orders%rowtype;
begin
  if p_status not in ('placed','pending','confirmed','paid','fulfilling','fulfilled','cancelled','refunded') then raise exception 'Invalid order status'; end if;
  select * into v_order from public.orders where id=p_order_id for update;
  if v_order.id is null then raise exception 'Order not found'; end if;
  if v_order.status = p_status then return v_order; end if;
  update public.orders set status=p_status, updated_at=now() where id=p_order_id returning * into v_order;
  return v_order;
end;
$$;
revoke execute on function public.update_order_status(uuid,text) from public, anon, authenticated;
grant execute on function public.update_order_status(uuid,text) to service_role;

create or replace function public.enforce_delivery_status_transition()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  if new.status = old.status then return new; end if;
  if old.status='pending' and new.status in ('preparing','cancelled') then return new; end if;
  if old.status='preparing' and new.status in ('ready_for_pickup','out_for_delivery','failed','cancelled') then return new; end if;
  if old.status='ready_for_pickup' and new.status in ('delivered','failed','cancelled') then return new; end if;
  if old.status='out_for_delivery' and new.status in ('delivered','failed','cancelled') then return new; end if;
  if old.status='failed' and new.status in ('preparing','cancelled') then return new; end if;
  raise exception 'Invalid delivery transition: % -> %', old.status, new.status;
end;
$$;

drop trigger if exists trg_deliveries_status_transition on public.deliveries;
create trigger trg_deliveries_status_transition before update of status on public.deliveries for each row execute function public.enforce_delivery_status_transition();

create or replace function public.update_delivery_status(p_order_id uuid, p_status text, p_tracking_reference text default null)
returns public.deliveries language plpgsql security definer set search_path = public as $$
declare
  v_delivery public.deliveries%rowtype;
  v_from_status text;
  v_order_status text;
  v_order public.orders%rowtype;
  v_notification_id uuid;
begin
  if p_status not in ('pending','preparing','ready_for_pickup','out_for_delivery','delivered','failed','cancelled') then raise exception 'Invalid delivery status'; end if;
  select * into v_order from public.orders where id=p_order_id for update;
  if v_order.id is null then raise exception 'Order not found'; end if;
  select * into v_delivery from public.deliveries where order_id=p_order_id for update;
  if v_delivery.id is null then raise exception 'Delivery not found'; end if;
  if v_delivery.status = p_status then
    update public.deliveries set tracking_reference=coalesce(p_tracking_reference,tracking_reference), updated_at=now() where id=v_delivery.id returning * into v_delivery;
    return v_delivery;
  end if;
  if p_status in ('preparing','ready_for_pickup','out_for_delivery','delivered') and v_order.status not in ('paid','fulfilling') then raise exception 'Order must be paid before fulfilment begins'; end if;
  if v_delivery.method='pickup' and p_status='out_for_delivery' then raise exception 'Pickup delivery cannot go out for delivery'; end if;
  if v_delivery.method<>'pickup' and p_status='ready_for_pickup' then raise exception 'Non-pickup delivery cannot become ready for pickup'; end if;
  v_from_status := v_delivery.status;
  update public.deliveries set status=p_status, tracking_reference=coalesce(p_tracking_reference,tracking_reference), delivered_at=case when p_status='delivered' then coalesce(delivered_at,now()) else delivered_at end, updated_at=now() where id=v_delivery.id returning * into v_delivery;
  insert into public.delivery_status_history(delivery_id,order_id,customer_id,from_status,to_status,tracking_reference,changed_at) values(v_delivery.id,v_delivery.order_id,v_delivery.customer_id,v_from_status,p_status,v_delivery.tracking_reference,now());
  v_order_status := case p_status when 'preparing' then 'fulfilling' when 'ready_for_pickup' then 'fulfilling' when 'out_for_delivery' then 'fulfilling' when 'delivered' then 'fulfilled' when 'cancelled' then 'cancelled' when 'failed' then 'fulfilling' else v_order.status end;
  if v_order.status not in ('cancelled','refunded','fulfilled') and v_order.status <> v_order_status then update public.orders set status=v_order_status, updated_at=now() where id=p_order_id; end if;
  insert into public.notifications(customer_id,type,title,body,aggregate_type,aggregate_id,action_type,action_target,dedupe_key) values(v_delivery.customer_id,'delivery.status_changed','Delivery status updated','Your delivery is now '||replace(p_status,'_',' ')||'.','order',v_delivery.order_id,'open_order','/orders/'||v_delivery.order_id,'delivery.status:'||v_delivery.order_id||':'||p_status) on conflict do nothing returning id into v_notification_id;
  if v_notification_id is not null then
    insert into public.notification_deliveries(notification_id,channel,status,next_attempt_at) values(v_notification_id,'in_app','sent',now()) on conflict(notification_id,channel) do nothing;
    insert into public.notification_deliveries(notification_id,channel,status,next_attempt_at) values(v_notification_id,'push','pending',now()) on conflict(notification_id,channel) do nothing;
    insert into public.notification_deliveries(notification_id,channel,status,next_attempt_at) values(v_notification_id,'whatsapp','pending',now()) on conflict(notification_id,channel) do nothing;
  end if;
  return v_delivery;
end;
$$;
revoke execute on function public.update_delivery_status(uuid,text,text) from public, anon, authenticated;
grant execute on function public.update_delivery_status(uuid,text,text) to service_role;
