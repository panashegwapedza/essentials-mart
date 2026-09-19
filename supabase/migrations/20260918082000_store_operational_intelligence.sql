-- Operational intelligence: durable store event stream and dashboard projection.

create table if not exists public.store_operation_events (
  id uuid primary key default gen_random_uuid(),
  store_id uuid not null references public.stores(id),
  event_type text not null,
  entity_type text not null,
  entity_id uuid,
  actor_id uuid,
  severity text not null default 'info' check (severity in ('info','warning','critical')),
  payload jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists store_operation_events_store_created_idx
  on public.store_operation_events(store_id, created_at desc);
create index if not exists store_operation_events_store_severity_idx
  on public.store_operation_events(store_id, severity, created_at desc);
create index if not exists store_operation_events_entity_idx
  on public.store_operation_events(entity_type, entity_id, created_at desc);

alter table public.store_operation_events enable row level security;

drop policy if exists "store_staff_operation_events_read" on public.store_operation_events;
create policy "store_staff_operation_events_read" on public.store_operation_events
for select to authenticated using ((select private.is_store_staff(store_id)));

grant select on public.store_operation_events to authenticated;

create or replace function private.record_store_operation_event(
  p_store_id uuid,p_event_type text,p_entity_type text,p_entity_id uuid,
  p_severity text,p_payload jsonb,p_actor_id uuid default null
) returns void
language plpgsql security definer
set search_path='public','private','pg_catalog' as $$
begin
  insert into public.store_operation_events(
    store_id,event_type,entity_type,entity_id,actor_id,severity,payload
  ) values (
    p_store_id,p_event_type,p_entity_type,p_entity_id,
    coalesce(p_actor_id,auth.uid()),p_severity,coalesce(p_payload,'{}'::jsonb)
  );
end;
$$;

revoke execute on function private.record_store_operation_event(uuid,text,text,uuid,text,jsonb,uuid)
from public,anon,authenticated;

create or replace function private.capture_store_order_event()
returns trigger language plpgsql security definer
set search_path='public','private','pg_catalog' as $$
begin
  if tg_op='INSERT' then
    perform private.record_store_operation_event(new.store_id,'order.created','order',new.id,'info',
      jsonb_build_object('status',new.status,'payment_status',new.payment_status));
  elsif new.status is distinct from old.status then
    perform private.record_store_operation_event(
      new.store_id,
      case when new.status='cancelled' then 'order.cancelled'
           when new.status='fulfilled' then 'order.fulfilled'
           when new.status='fulfilling' then 'order.fulfilment_started'
           else 'order.status_changed' end,
      'order',new.id,case when new.status='cancelled' then 'warning' else 'info' end,
      jsonb_build_object('from_status',old.status,'to_status',new.status));
  end if;
  return new;
end;
$$;

create or replace function private.capture_store_fulfilment_event()
returns trigger language plpgsql security definer
set search_path='public','private','pg_catalog' as $$
begin
  if tg_op='INSERT' then
    perform private.record_store_operation_event(new.store_id,'fulfilment.started','fulfilment',new.id,'info',
      jsonb_build_object('order_id',new.order_id,'status',new.status),new.picker_auth_user_id);
  elsif new.status is distinct from old.status then
    perform private.record_store_operation_event(
      new.store_id,
      case when new.status='partial' then 'fulfilment.exception'
           when new.status='handed_off' then 'fulfilment.handed_off'
           when new.status='cancelled' then 'fulfilment.cancelled'
           else 'fulfilment.status_changed' end,
      'fulfilment',new.id,case when new.status='partial' then 'warning' else 'info' end,
      jsonb_build_object('order_id',new.order_id,'from_status',old.status,'to_status',new.status),
      new.picker_auth_user_id);
  end if;
  return new;
end;
$$;

create or replace function private.capture_store_fulfilment_item_event()
returns trigger language plpgsql security definer
set search_path='public','private','pg_catalog' as $$
declare v_store_id uuid; v_order_id uuid;
begin
  select f.store_id,f.order_id into v_store_id,v_order_id
  from public.order_fulfilments f where f.id=new.fulfilment_id;
  if new.status is distinct from old.status
     or new.substitution_product_id is distinct from old.substitution_product_id then
    perform private.record_store_operation_event(
      v_store_id,
      case when new.status='unavailable' then 'fulfilment.item_unavailable'
           when new.status='partial' then 'fulfilment.item_partial'
           when new.status='substituted' then 'fulfilment.item_substituted'
           else 'fulfilment.item_resolved' end,
      'fulfilment_item',new.id,
      case when new.status in ('unavailable','partial') then 'warning' else 'info' end,
      jsonb_build_object(
        'order_id',v_order_id,'fulfilment_id',new.fulfilment_id,'order_item_id',new.order_item_id,
        'requested_quantity',new.requested_quantity,'picked_quantity',new.picked_quantity,
        'status',new.status,'substitution_product_id',new.substitution_product_id,
        'substitution_quantity',new.substitution_quantity,'notes',new.notes));
  end if;
  return new;
end;
$$;

create or replace function private.capture_store_inventory_adjustment_event()
returns trigger language plpgsql security definer
set search_path='public','private','pg_catalog' as $$
begin
  perform private.record_store_operation_event(
    new.store_id,
    case when new.quantity_delta < 0 then 'inventory.decrease' else 'inventory.increase' end,
    'inventory',new.product_id,
    case when new.quantity_delta < 0 then 'warning' else 'info' end,
    jsonb_build_object('quantity_delta',new.quantity_delta,'reason',new.reason,
      'reference_type',new.reference_type,'reference_id',new.reference_id),new.performed_by);
  return new;
end;
$$;

create or replace function private.capture_store_delivery_event()
returns trigger language plpgsql security definer
set search_path='public','private','pg_catalog' as $$
begin
  if new.status is distinct from old.status then
    perform private.record_store_operation_event(
      new.store_id,
      case when new.status='failed' then 'delivery.failed'
           when new.status='delivered' then 'delivery.delivered'
           else 'delivery.status_changed' end,
      'delivery',new.id,case when new.status='failed' then 'critical' else 'info' end,
      jsonb_build_object('order_id',new.order_id,'from_status',old.status,
        'to_status',new.status,'method',new.method));
  end if;
  return new;
end;
$$;

drop trigger if exists store_order_operation_events on public.orders;
create trigger store_order_operation_events after insert or update of status on public.orders
for each row execute function private.capture_store_order_event();

drop trigger if exists store_fulfilment_operation_events on public.order_fulfilments;
create trigger store_fulfilment_operation_events after insert or update of status on public.order_fulfilments
for each row execute function private.capture_store_fulfilment_event();

drop trigger if exists store_fulfilment_item_operation_events on public.order_fulfilment_items;
create trigger store_fulfilment_item_operation_events
after update of status,substitution_product_id,picked_quantity on public.order_fulfilment_items
for each row execute function private.capture_store_fulfilment_item_event();

drop trigger if exists store_inventory_adjustment_operation_events on public.inventory_adjustments;
create trigger store_inventory_adjustment_operation_events after insert on public.inventory_adjustments
for each row execute function private.capture_store_inventory_adjustment_event();

drop trigger if exists store_delivery_operation_events on public.deliveries;
create trigger store_delivery_operation_events after update of status on public.deliveries
for each row execute function private.capture_store_delivery_event();

create or replace function private.get_store_ops_dashboard(p_store_id uuid)
returns jsonb language plpgsql security definer
set search_path='public','private','pg_catalog' as $$
begin
  if not private.has_store_role(
    p_store_id,
    array['store_operator','fulfilment_operator','store_manager','enterprise_admin']::public.store_staff_role[]
  ) then raise exception 'Store operations access denied'; end if;

  return jsonb_build_object(
    'store_id',p_store_id,'generated_at',now(),
    'workload',jsonb_build_object(
      'orders_paid',(select count(*) from public.orders o where o.store_id=p_store_id and o.status='paid'),
      'orders_fulfilling',(select count(*) from public.orders o where o.store_id=p_store_id and o.status='fulfilling'),
      'orders_ready',(select count(*) from public.order_fulfilments f where f.store_id=p_store_id and f.status in ('ready','partial'))),
    'exceptions',jsonb_build_object(
      'unavailable_items',(select count(*) from public.order_fulfilment_items i join public.order_fulfilments f on f.id=i.fulfilment_id where f.store_id=p_store_id and i.status='unavailable'),
      'partial_items',(select count(*) from public.order_fulfilment_items i join public.order_fulfilments f on f.id=i.fulfilment_id where f.store_id=p_store_id and i.status='partial'),
      'failed_deliveries',(select count(*) from public.deliveries d where d.store_id=p_store_id and d.status='failed'),
      'low_stock_items',(select count(*) from public.inventory i where i.store_id=p_store_id and i.quantity-i.reserved_quantity <= 5)),
    'recent_events',coalesce((
      select jsonb_agg(jsonb_build_object('id',e.id,'event_type',e.event_type,
        'entity_type',e.entity_type,'entity_id',e.entity_id,'severity',e.severity,
        'payload',e.payload,'created_at',e.created_at) order by e.created_at desc)
      from (select * from public.store_operation_events where store_id=p_store_id
            order by created_at desc limit 25) e),'[]'::jsonb)
  );
end;
$$;

revoke execute on function private.get_store_ops_dashboard(uuid) from public,anon,authenticated;

create or replace function public.get_store_ops_dashboard(p_store_id uuid)
returns jsonb language sql security invoker set search_path='public'
as $$ select private.get_store_ops_dashboard($1); $$;

revoke execute on function public.get_store_ops_dashboard(uuid) from public,anon;
grant execute on function public.get_store_ops_dashboard(uuid) to authenticated;

alter publication supabase_realtime add table public.store_operation_events;
