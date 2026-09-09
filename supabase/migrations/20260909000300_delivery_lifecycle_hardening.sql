create table if not exists public.delivery_status_history (
  id uuid primary key default gen_random_uuid(),
  delivery_id uuid not null references public.deliveries(id) on delete restrict,
  order_id uuid not null references public.orders(id) on delete restrict,
  customer_id uuid not null references public.customers(id) on delete restrict,
  from_status text,
  to_status text not null check (to_status = any (array['pending','preparing','ready_for_pickup','out_for_delivery','delivered','failed','cancelled'])),
  tracking_reference text,
  changed_at timestamptz not null default now()
);
create index if not exists idx_delivery_status_history_delivery_changed on public.delivery_status_history(delivery_id, changed_at desc);
create index if not exists idx_delivery_status_history_order_changed on public.delivery_status_history(order_id, changed_at desc);

alter table public.delivery_status_history enable row level security;
drop policy if exists delivery_status_history_customer_select on public.delivery_status_history;
create policy delivery_status_history_customer_select on public.delivery_status_history for select to authenticated using (customer_id = (select id from public.customers where auth_user_id = auth.uid()));

insert into public.delivery_status_history(delivery_id,order_id,customer_id,from_status,to_status,tracking_reference,changed_at)
select d.id,d.order_id,d.customer_id,null,d.status,d.tracking_reference,d.created_at
from public.deliveries d
where not exists (select 1 from public.delivery_status_history h where h.delivery_id=d.id);

create or replace function public.update_delivery_status(p_order_id uuid, p_status text, p_tracking_reference text default null)
returns public.deliveries
language plpgsql
security definer
set search_path = public
as $$
declare
  v_delivery public.deliveries%rowtype;
  v_previous_status text;
  v_order_status text;
  v_allowed boolean := false;
  v_notification_id uuid;
begin
  if p_status not in ('pending','preparing','ready_for_pickup','out_for_delivery','delivered','failed','cancelled') then raise exception 'Invalid delivery status'; end if;
  select * into v_delivery from public.deliveries where order_id=p_order_id for update;
  if v_delivery.id is null then raise exception 'Delivery not found'; end if;
  v_previous_status := v_delivery.status;
  if v_previous_status = p_status then
    update public.deliveries set tracking_reference=coalesce(p_tracking_reference,tracking_reference), updated_at=now() where id=v_delivery.id returning * into v_delivery;
    return v_delivery;
  end if;
  if v_previous_status='pending' and p_status in ('preparing','cancelled') then v_allowed := true;
  elsif v_previous_status='preparing' and p_status in ('ready_for_pickup','out_for_delivery','failed','cancelled') then v_allowed := true;
  elsif v_previous_status='ready_for_pickup' and p_status in ('delivered','failed','cancelled') then v_allowed := true;
  elsif v_previous_status='out_for_delivery' and p_status in ('delivered','failed','cancelled') then v_allowed := true;
  elsif v_previous_status='failed' and p_status in ('preparing','cancelled') then v_allowed := true;
  end if;
  if v_delivery.method='pickup' and p_status='out_for_delivery' then v_allowed := false; end if;
  if v_delivery.method<>'pickup' and p_status='ready_for_pickup' then v_allowed := false; end if;
  if not v_allowed then raise exception 'Invalid delivery transition: % -> %', v_previous_status, p_status; end if;
  update public.deliveries set status=p_status, tracking_reference=coalesce(p_tracking_reference,tracking_reference), delivered_at=case when p_status='delivered' then coalesce(delivered_at,now()) else delivered_at end, updated_at=now() where id=v_delivery.id returning * into v_delivery;
  insert into public.delivery_status_history(delivery_id,order_id,customer_id,from_status,to_status,tracking_reference,changed_at) values(v_delivery.id,v_delivery.order_id,v_delivery.customer_id,v_previous_status,p_status,v_delivery.tracking_reference,now());
  v_order_status := case p_status when 'preparing' then 'fulfilling' when 'ready_for_pickup' then 'fulfilling' when 'out_for_delivery' then 'fulfilling' when 'delivered' then 'fulfilled' when 'cancelled' then 'cancelled' when 'failed' then 'fulfilling' else 'confirmed' end;
  update public.orders set status=v_order_status, updated_at=now() where id=p_order_id and status not in ('cancelled','refunded','fulfilled');
  insert into public.notifications(customer_id,type,title,body,aggregate_type,aggregate_id,action_type,action_target,dedupe_key) values(v_delivery.customer_id,'delivery.status_changed','Delivery status updated','Your delivery is now '||replace(p_status,'_',' ')||'.','order',v_delivery.order_id,'open_order','/orders/'||v_delivery.order_id,'delivery.status:'||v_delivery.order_id||':'||p_status||':'||extract(epoch from clock_timestamp())::bigint) returning id into v_notification_id;
  insert into public.notification_deliveries(notification_id,channel,status,next_attempt_at) values(v_notification_id,'in_app','sent',now()) on conflict(notification_id,channel) do nothing;
  insert into public.notification_deliveries(notification_id,channel,status,next_attempt_at) values(v_notification_id,'push','pending',now()) on conflict(notification_id,channel) do nothing;
  insert into public.notification_deliveries(notification_id,channel,status,next_attempt_at) values(v_notification_id,'whatsapp','pending',now()) on conflict(notification_id,channel) do nothing;
  return v_delivery;
end;
$$;
revoke execute on function public.update_delivery_status(uuid,text,text) from public, anon, authenticated;
grant execute on function public.update_delivery_status(uuid,text,text) to service_role;
revoke execute on function public.ensure_order_operational_records() from public, anon, authenticated;
grant execute on function public.ensure_order_operational_records() to service_role;
