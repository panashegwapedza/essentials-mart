create table if not exists public.deliveries (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null unique references public.orders(id) on delete restrict,
  customer_id uuid not null references public.customers(id) on delete restrict,
  method text not null check (method = any (array['pickup','standard','express'])),
  status text not null default 'pending' check (status = any (array['pending','preparing','ready_for_pickup','out_for_delivery','delivered','failed','cancelled'])),
  tracking_reference text,
  scheduled_for timestamptz,
  delivered_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists idx_deliveries_customer_updated on public.deliveries(customer_id, updated_at desc);
create index if not exists idx_deliveries_status_updated on public.deliveries(status, updated_at desc);

create table if not exists public.payment_transactions (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete restrict,
  customer_id uuid not null references public.customers(id) on delete restrict,
  provider text not null,
  provider_transaction_id text,
  status text not null default 'pending' check (status = any (array['pending','authorized','paid','failed','cancelled','refunded'])),
  amount numeric not null check (amount >= 0),
  currency text not null,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists idx_payment_transactions_order_created on public.payment_transactions(order_id, created_at desc);
create unique index if not exists uq_payment_transactions_provider_ref on public.payment_transactions(provider, provider_transaction_id) where provider_transaction_id is not null;

create table if not exists public.notifications (
  id uuid primary key default gen_random_uuid(),
  customer_id uuid not null references public.customers(id) on delete cascade,
  type text not null,
  title text not null,
  body text not null,
  aggregate_type text,
  aggregate_id uuid,
  action_type text,
  action_target text,
  status text not null default 'unread' check (status = any (array['unread','read','archived'])),
  dedupe_key text unique,
  created_at timestamptz not null default now(),
  read_at timestamptz
);
create index if not exists idx_notifications_customer_created on public.notifications(customer_id, created_at desc);
create index if not exists idx_notifications_customer_status on public.notifications(customer_id, status, created_at desc);

create table if not exists public.notification_deliveries (
  id uuid primary key default gen_random_uuid(),
  notification_id uuid not null references public.notifications(id) on delete cascade,
  channel text not null check (channel = any (array['in_app','push','whatsapp','email'])),
  status text not null default 'pending' check (status = any (array['pending','sent','failed','cancelled'])),
  attempts integer not null default 0 check (attempts >= 0),
  next_attempt_at timestamptz,
  delivered_at timestamptz,
  last_error text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(notification_id, channel)
);
create index if not exists idx_notification_deliveries_pending on public.notification_deliveries(status, next_attempt_at);

alter table public.deliveries enable row level security;
alter table public.payment_transactions enable row level security;
alter table public.notifications enable row level security;
alter table public.notification_deliveries enable row level security;

drop policy if exists deliveries_customer_select on public.deliveries;
create policy deliveries_customer_select on public.deliveries for select to authenticated using (customer_id = (select id from public.customers where auth_user_id = auth.uid()));
drop policy if exists payment_transactions_customer_select on public.payment_transactions;
create policy payment_transactions_customer_select on public.payment_transactions for select to authenticated using (customer_id = (select id from public.customers where auth_user_id = auth.uid()));
drop policy if exists notifications_customer_select on public.notifications;
create policy notifications_customer_select on public.notifications for select to authenticated using (customer_id = (select id from public.customers where auth_user_id = auth.uid()));
drop policy if exists notifications_customer_update on public.notifications;
create policy notifications_customer_update on public.notifications for update to authenticated using (customer_id = (select id from public.customers where auth_user_id = auth.uid())) with check (customer_id = (select id from public.customers where auth_user_id = auth.uid()));
drop policy if exists notification_deliveries_customer_select on public.notification_deliveries;
create policy notification_deliveries_customer_select on public.notification_deliveries for select to authenticated using (notification_id in (select n.id from public.notifications n where n.customer_id = (select id from public.customers where auth_user_id = auth.uid())));

create or replace function public.ensure_order_operational_records()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare v_notification_id uuid;
begin
  if tg_op = 'INSERT' then
    insert into public.deliveries(order_id, customer_id, method, status)
    values (new.id, new.customer_id, new.delivery_method, 'pending')
    on conflict (order_id) do nothing;
    insert into public.notifications(customer_id,type,title,body,aggregate_type,aggregate_id,action_type,action_target,dedupe_key)
    values(new.customer_id,'order.confirmed','Order confirmed','Your order has been confirmed and is now being prepared.','order',new.id,'open_order','/orders/'||new.id,'order.confirmed:'||new.id)
    on conflict (dedupe_key) do nothing returning id into v_notification_id;
    if v_notification_id is not null then
      insert into public.notification_deliveries(notification_id,channel,status,next_attempt_at) values(v_notification_id,'in_app','sent',now()) on conflict(notification_id,channel) do nothing;
      insert into public.notification_deliveries(notification_id,channel,status,next_attempt_at) values(v_notification_id,'push','pending',now()) on conflict(notification_id,channel) do nothing;
      insert into public.notification_deliveries(notification_id,channel,status,next_attempt_at) values(v_notification_id,'whatsapp','pending',now()) on conflict(notification_id,channel) do nothing;
    end if;
  elsif tg_op = 'UPDATE' and new.status is distinct from old.status then
    insert into public.notifications(customer_id,type,title,body,aggregate_type,aggregate_id,action_type,action_target,dedupe_key)
    values(new.customer_id,'order.status_changed','Order status updated','Your order is now '||replace(new.status,'_',' ')||'.','order',new.id,'open_order','/orders/'||new.id,'order.status:'||new.id||':'||new.status)
    on conflict (dedupe_key) do nothing returning id into v_notification_id;
    if v_notification_id is not null then
      insert into public.notification_deliveries(notification_id,channel,status,next_attempt_at) values(v_notification_id,'in_app','sent',now()) on conflict(notification_id,channel) do nothing;
      insert into public.notification_deliveries(notification_id,channel,status,next_attempt_at) values(v_notification_id,'push','pending',now()) on conflict(notification_id,channel) do nothing;
      insert into public.notification_deliveries(notification_id,channel,status,next_attempt_at) values(v_notification_id,'whatsapp','pending',now()) on conflict(notification_id,channel) do nothing;
    end if;
  end if;
  return new;
end;
$$;

drop trigger if exists trg_orders_operational_records on public.orders;
create trigger trg_orders_operational_records after insert or update of status on public.orders for each row execute function public.ensure_order_operational_records();

create or replace function public.update_delivery_status(p_order_id uuid, p_status text, p_tracking_reference text default null)
returns public.deliveries
language plpgsql
security definer
set search_path = public
as $$
declare v_delivery public.deliveries%rowtype; v_order_status text;
begin
  if p_status not in ('pending','preparing','ready_for_pickup','out_for_delivery','delivered','failed','cancelled') then raise exception 'Invalid delivery status'; end if;
  select * into v_delivery from public.deliveries where order_id=p_order_id for update;
  if v_delivery.id is null then raise exception 'Delivery not found'; end if;
  if v_delivery.status in ('delivered','cancelled') and v_delivery.status <> p_status then raise exception 'Delivery is terminal'; end if;
  update public.deliveries set status=p_status, tracking_reference=coalesce(p_tracking_reference,tracking_reference), delivered_at=case when p_status='delivered' then coalesce(delivered_at,now()) else delivered_at end, updated_at=now() where id=v_delivery.id returning * into v_delivery;
  v_order_status := case p_status when 'preparing' then 'fulfilling' when 'ready_for_pickup' then 'fulfilling' when 'out_for_delivery' then 'fulfilling' when 'delivered' then 'fulfilled' when 'cancelled' then 'cancelled' when 'failed' then 'fulfilling' else 'confirmed' end;
  update public.orders set status=v_order_status, updated_at=now() where id=p_order_id and status not in ('cancelled','refunded','fulfilled');
  return v_delivery;
end;
$$;
revoke execute on function public.update_delivery_status(uuid,text,text) from public, anon, authenticated;
grant execute on function public.update_delivery_status(uuid,text,text) to service_role;
