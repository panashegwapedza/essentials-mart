-- Keep store operations callable through authenticated RPC while keeping privileged
-- SECURITY DEFINER implementations outside the exposed public schema.

create or replace function private.ops_update_order_status(p_order_id uuid,p_status text)
returns public.orders language plpgsql security definer set search_path='public','private','pg_catalog' as $$
declare v_order public.orders%rowtype;
begin
  if p_status not in ('placed','pending','confirmed','paid','fulfilling','fulfilled','cancelled','refunded') then raise exception 'Invalid order status'; end if;
  select * into v_order from public.orders where id=p_order_id for update;
  if v_order.id is null then raise exception 'Order not found'; end if;
  if not private.has_store_role(v_order.store_id,array['store_operator','fulfilment_operator','store_manager','enterprise_admin']::public.store_staff_role[]) then raise exception 'Store operations access denied'; end if;
  if v_order.status=p_status then return v_order; end if;
  if p_status='fulfilling' and v_order.payment_status<>'paid' and v_order.status<>'paid' then raise exception 'Order must be paid before fulfilment begins'; end if;
  update public.orders set status=p_status,updated_at=now() where id=p_order_id returning * into v_order;
  return v_order;
end; $$;

create or replace function private.ops_start_order_fulfilment(p_order_id uuid)
returns public.order_fulfilments language plpgsql security definer set search_path='public','private','pg_catalog' as $$
declare v_order public.orders%rowtype; v_f public.order_fulfilments%rowtype; v_item record;
begin
  select * into v_order from public.orders where id=p_order_id for update;
  if v_order.id is null then raise exception 'Order not found'; end if;
  if not private.has_store_role(v_order.store_id,array['store_operator','fulfilment_operator','store_manager','enterprise_admin']::public.store_staff_role[]) then raise exception 'Store fulfilment access denied'; end if;
  if v_order.payment_status<>'paid' and v_order.status<>'paid' then raise exception 'Order must be paid before fulfilment begins'; end if;
  select * into v_f from public.order_fulfilments where order_id=p_order_id for update;
  if v_f.id is not null then return v_f; end if;
  perform private.ops_update_order_status(p_order_id,'fulfilling');
  insert into public.order_fulfilments(order_id,store_id,status,picker_auth_user_id,started_at) values(p_order_id,v_order.store_id,'picking',auth.uid(),now()) returning * into v_f;
  for v_item in select id,quantity from public.order_items where order_id=p_order_id order by id loop
    insert into public.order_fulfilment_items(fulfilment_id,order_item_id,requested_quantity) values(v_f.id,v_item.id,v_item.quantity);
  end loop;
  return v_f;
end; $$;

create or replace function private.ops_record_fulfilment_item(p_fulfilment_item_id uuid,p_picked_quantity integer,p_substitution_product_id uuid default null,p_substitution_quantity integer default null,p_notes text default null)
returns public.order_fulfilment_items language plpgsql security definer set search_path='public','private','pg_catalog' as $$
declare v_fi public.order_fulfilment_items%rowtype; v_f public.order_fulfilments%rowtype; v_inv public.inventory%rowtype; v_old public.inventory%rowtype; v_original_product uuid;
begin
  if p_picked_quantity<0 then raise exception 'Picked quantity cannot be negative'; end if;
  select * into v_fi from public.order_fulfilment_items where id=p_fulfilment_item_id for update;
  if v_fi.id is null then raise exception 'Fulfilment item not found'; end if;
  select * into v_f from public.order_fulfilments where id=v_fi.fulfilment_id for update;
  if not private.has_store_role(v_f.store_id,array['store_operator','fulfilment_operator','store_manager','enterprise_admin']::public.store_staff_role[]) then raise exception 'Store fulfilment access denied'; end if;
  if p_picked_quantity>v_fi.requested_quantity then raise exception 'Picked quantity exceeds requested quantity'; end if;
  select product_id into v_original_product from public.order_items where id=v_fi.order_item_id;
  if p_substitution_product_id is null then
    v_fi.picked_quantity:=p_picked_quantity; v_fi.substitution_product_id:=null; v_fi.substitution_quantity:=null;
    v_fi.status:=case when p_picked_quantity=v_fi.requested_quantity then 'picked' when p_picked_quantity=0 then 'unavailable' else 'partial' end;
  else
    if p_substitution_quantity is null or p_substitution_quantity<=0 then raise exception 'Substitution quantity is required'; end if;
    if p_substitution_product_id=v_original_product then raise exception 'Substitution product must differ from original product'; end if;
    select * into v_inv from public.inventory where store_id=v_f.store_id and product_id=p_substitution_product_id for update;
    if v_inv.product_id is null then raise exception 'Substitution inventory unavailable'; end if;
    if v_inv.quantity-v_inv.reserved_quantity<p_substitution_quantity then raise exception 'Insufficient substitution inventory'; end if;
    update public.inventory set quantity=quantity-p_substitution_quantity,updated_at=now() where store_id=v_f.store_id and product_id=p_substitution_product_id;
    if p_picked_quantity>0 then
      select * into v_old from public.inventory where store_id=v_f.store_id and product_id=v_original_product for update;
      if v_old.product_id is not null then update public.inventory set quantity=quantity+p_picked_quantity,updated_at=now() where store_id=v_f.store_id and product_id=v_original_product; end if;
    end if;
    v_fi.picked_quantity:=p_picked_quantity; v_fi.substitution_product_id:=p_substitution_product_id; v_fi.substitution_quantity:=p_substitution_quantity; v_fi.status:='substituted';
  end if;
  update public.order_fulfilment_items set picked_quantity=v_fi.picked_quantity,status=v_fi.status,substitution_product_id=v_fi.substitution_product_id,substitution_quantity=v_fi.substitution_quantity,notes=p_notes,updated_at=now() where id=v_fi.id returning * into v_fi;
  return v_fi;
end; $$;

create or replace function private.ops_complete_order_fulfilment(p_order_id uuid,p_hand_off boolean default false)
returns public.order_fulfilments language plpgsql security definer set search_path='public','private','pg_catalog' as $$
declare v_f public.order_fulfilments%rowtype; v_pending integer; v_partial integer;
begin
  select * into v_f from public.order_fulfilments where order_id=p_order_id for update;
  if v_f.id is null then raise exception 'Fulfilment not found'; end if;
  if not private.has_store_role(v_f.store_id,array['store_operator','fulfilment_operator','store_manager','enterprise_admin']::public.store_staff_role[]) then raise exception 'Store fulfilment access denied'; end if;
  select count(*) filter(where status='pending'),count(*) filter(where status in ('partial','unavailable')) into v_pending,v_partial from public.order_fulfilment_items where fulfilment_id=v_f.id;
  if v_pending>0 then raise exception 'All fulfilment items must be resolved'; end if;
  if p_hand_off then
    update public.order_fulfilments set status=case when v_partial>0 then 'partial' else 'handed_off' end,handed_off_at=now(),completed_at=now(),updated_at=now() where id=v_f.id returning * into v_f;
    perform private.ops_update_order_status(p_order_id,'fulfilled');
  else
    update public.order_fulfilments set status=case when v_partial>0 then 'partial' else 'ready' end,completed_at=now(),updated_at=now() where id=v_f.id returning * into v_f;
  end if;
  return v_f;
end; $$;

create or replace function private.ops_adjust_store_inventory(p_store_id uuid,p_product_id uuid,p_quantity_delta integer,p_reason text,p_reference_type text default null,p_reference_id uuid default null)
returns public.inventory_adjustments language plpgsql security definer set search_path='public','private','pg_catalog' as $$
declare v_inv public.inventory%rowtype; v_adj public.inventory_adjustments%rowtype;
begin
  if p_quantity_delta=0 then raise exception 'Inventory adjustment cannot be zero'; end if;
  if p_reason not in ('damage','waste','count_correction','receiving','transfer','substitution','other') then raise exception 'Invalid inventory adjustment reason'; end if;
  if not private.has_store_role(p_store_id,array['store_manager','enterprise_admin']::public.store_staff_role[]) then raise exception 'Inventory adjustment access denied'; end if;
  select * into v_inv from public.inventory where store_id=p_store_id and product_id=p_product_id for update;
  if v_inv.product_id is null then raise exception 'Inventory item not found'; end if;
  if v_inv.quantity+p_quantity_delta<0 then raise exception 'Inventory cannot become negative'; end if;
  update public.inventory set quantity=quantity+p_quantity_delta,updated_at=now() where store_id=p_store_id and product_id=p_product_id;
  insert into public.inventory_adjustments(store_id,product_id,quantity_delta,reason,reference_type,reference_id,performed_by) values(p_store_id,p_product_id,p_quantity_delta,p_reason,p_reference_type,p_reference_id,auth.uid()) returning * into v_adj;
  return v_adj;
end; $$;

create or replace function private.ops_update_delivery_status(p_order_id uuid,p_status text,p_tracking_reference text default null)
returns public.deliveries language plpgsql security definer set search_path='public','private','pg_catalog' as $$
declare v_delivery public.deliveries%rowtype; v_order public.orders%rowtype; v_from text; v_n uuid;
begin
  if p_status not in ('pending','preparing','ready_for_pickup','out_for_delivery','delivered','failed','cancelled') then raise exception 'Invalid delivery status'; end if;
  select * into v_order from public.orders where id=p_order_id for update;
  select * into v_delivery from public.deliveries where order_id=p_order_id for update;
  if v_order.id is null or v_delivery.id is null then raise exception 'Order or delivery not found'; end if;
  if not private.has_store_role(v_order.store_id,array['store_operator','fulfilment_operator','store_manager','enterprise_admin']::public.store_staff_role[]) then raise exception 'Store operations access denied'; end if;
  if v_delivery.status=p_status then return v_delivery; end if;
  if p_status in ('preparing','ready_for_pickup','out_for_delivery','delivered') and v_order.status not in ('paid','fulfilling') then raise exception 'Order must be paid before fulfilment begins'; end if;
  if v_delivery.method='pickup' and p_status='out_for_delivery' then raise exception 'Pickup delivery cannot go out for delivery'; end if;
  if v_delivery.method<>'pickup' and p_status='ready_for_pickup' then raise exception 'Non-pickup delivery cannot become ready for pickup'; end if;
  v_from:=v_delivery.status;
  update public.deliveries set status=p_status,tracking_reference=coalesce(p_tracking_reference,tracking_reference),delivered_at=case when p_status='delivered' then coalesce(delivered_at,now()) else delivered_at end,updated_at=now() where id=v_delivery.id returning * into v_delivery;
  insert into public.delivery_status_history(delivery_id,order_id,customer_id,from_status,to_status,tracking_reference,changed_at) values(v_delivery.id,v_delivery.order_id,v_delivery.customer_id,v_from,p_status,v_delivery.tracking_reference,now());
  if p_status='delivered' and v_order.status not in ('cancelled','refunded','fulfilled') then update public.orders set status='fulfilled',updated_at=now() where id=p_order_id; end if;
  insert into public.notifications(customer_id,type,title,body,aggregate_type,aggregate_id,action_type,action_target,dedupe_key) values(v_delivery.customer_id,'delivery.status_changed','Delivery status updated','Your delivery is now '||replace(p_status,'_',' ')||'.','order',v_delivery.order_id,'open_order','/orders/'||v_delivery.order_id,'delivery.status:'||v_delivery.order_id||':'||p_status) on conflict do nothing returning id into v_n;
  if v_n is not null then
    insert into public.notification_deliveries(notification_id,channel,status,next_attempt_at) values(v_n,'in_app','sent',now()) on conflict(notification_id,channel) do nothing;
    insert into public.notification_deliveries(notification_id,channel,status,next_attempt_at) values(v_n,'push','pending',now()) on conflict(notification_id,channel) do nothing;
    insert into public.notification_deliveries(notification_id,channel,status,next_attempt_at) values(v_n,'whatsapp','pending',now()) on conflict(notification_id,channel) do nothing;
  end if;
  return v_delivery;
end; $$;

revoke execute on function private.ops_update_order_status(uuid,text) from public,anon,authenticated;
revoke execute on function private.ops_start_order_fulfilment(uuid) from public,anon,authenticated;
revoke execute on function private.ops_record_fulfilment_item(uuid,integer,uuid,integer,text) from public,anon,authenticated;
revoke execute on function private.ops_complete_order_fulfilment(uuid,boolean) from public,anon,authenticated;
revoke execute on function private.ops_adjust_store_inventory(uuid,uuid,integer,text,text,uuid) from public,anon,authenticated;
revoke execute on function private.ops_update_delivery_status(uuid,text,text) from public,anon,authenticated;

create or replace function public.update_order_status(p_order_id uuid,p_status text)
returns public.orders language sql security invoker set search_path='public' as $$ select private.ops_update_order_status($1,$2); $$;
create or replace function public.start_order_fulfilment(p_order_id uuid)
returns public.order_fulfilments language sql security invoker set search_path='public' as $$ select private.ops_start_order_fulfilment($1); $$;
create or replace function public.record_fulfilment_item(p_fulfilment_item_id uuid,p_picked_quantity integer,p_substitution_product_id uuid default null,p_substitution_quantity integer default null,p_notes text default null)
returns public.order_fulfilment_items language sql security invoker set search_path='public' as $$ select private.ops_record_fulfilment_item($1,$2,$3,$4,$5); $$;
create or replace function public.complete_order_fulfilment(p_order_id uuid,p_hand_off boolean default false)
returns public.order_fulfilmentS language sql security invoker set search_path='public' as $$ select private.ops_complete_order_fulfilment($1,$2); $$;
create or replace function public.adjust_store_inventory(p_store_id uuid,p_product_id uuid,p_quantity_delta integer,p_reason text,p_reference_type text default null,p_reference_id uuid default null)
returns public.inventory_adjustments language sql security invoker set search_path='public' as $$ select private.ops_adjust_store_inventory($1,$2,$3,$4,$5,$6); $$;
create or replace function public.update_delivery_status(p_order_id uuid,p_status text,p_tracking_reference text default null)
returns public.deliveries language sql security invoker set search_path='public' as $$ select private.ops_update_delivery_status($1,$2,$3); $$;

grant execute on function public.update_order_status(uuid,text) to authenticated;
grant execute on function public.start_order_fulfilment(uuid) to authenticated;
grant execute on function public.record_fulfilment_item(uuid,integer,uuid,integer,text) to authenticated;
grant execute on function public.complete_order_fulfilment(uuid,boolean) to authenticated;
grant execute on function public.adjust_store_inventory(uuid,uuid,integer,text,text,uuid) to authenticated;
grant execute on function public.update_delivery_status(uuid,text,text) to authenticated;
