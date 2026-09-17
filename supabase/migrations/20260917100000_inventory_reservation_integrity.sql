create table if not exists public.inventory_reservations (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  product_id uuid not null references public.products(id) on delete restrict,
  quantity integer not null check (quantity > 0),
  status text not null default 'reserved' check (status in ('reserved','consumed','released')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (order_id, product_id)
);

create table if not exists public.inventory_reservation_events (
  id uuid primary key default gen_random_uuid(),
  reservation_id uuid not null references public.inventory_reservations(id) on delete cascade,
  order_id uuid not null references public.orders(id) on delete cascade,
  product_id uuid not null references public.products(id) on delete restrict,
  event_type text not null check (event_type in ('reserved','consumed','released')),
  quantity integer not null check (quantity > 0),
  created_at timestamptz not null default now()
);

create index if not exists idx_inventory_reservations_order on public.inventory_reservations(order_id);
create index if not exists idx_inventory_reservations_product_status on public.inventory_reservations(product_id,status);
create index if not exists idx_inventory_reservation_events_order on public.inventory_reservation_events(order_id,created_at desc);

alter table public.inventory_reservations enable row level security;
alter table public.inventory_reservation_events enable row level security;
revoke all on public.inventory_reservations from public,anon,authenticated;
revoke all on public.inventory_reservation_events from public,anon,authenticated;

create or replace function public.reserve_inventory_for_order(p_order_id uuid)
returns void
language plpgsql
security definer
set search_path to public, pg_catalog
as $$
declare
  v_item record;
  v_inventory public.inventory%rowtype;
  v_reservation public.inventory_reservations%rowtype;
begin
  for v_item in
    select oi.product_id, oi.quantity
    from public.order_items oi
    where oi.order_id = p_order_id
      and oi.product_id is not null
    order by oi.product_id
  loop
    select * into v_reservation
    from public.inventory_reservations
    where order_id = p_order_id and product_id = v_item.product_id
    for update;

    if v_reservation.id is not null then
      if v_reservation.status <> 'reserved' or v_reservation.quantity <> v_item.quantity then
        raise exception 'Inventory reservation already finalized for order item';
      end if;
      continue;
    end if;

    select * into v_inventory
    from public.inventory
    where product_id = v_item.product_id
    for update;

    if v_inventory.product_id is null then
      raise exception 'Inventory unavailable';
    end if;

    if v_inventory.quantity - v_inventory.reserved_quantity < v_item.quantity then
      raise exception 'Insufficient inventory';
    end if;

    insert into public.inventory_reservations(order_id,product_id,quantity,status)
    values (p_order_id,v_item.product_id,v_item.quantity,'reserved')
    returning * into v_reservation;

    update public.inventory
    set reserved_quantity = reserved_quantity + v_item.quantity,
        updated_at = now()
    where product_id = v_item.product_id;

    insert into public.inventory_reservation_events(reservation_id,order_id,product_id,event_type,quantity)
    values (v_reservation.id,p_order_id,v_item.product_id,'reserved',v_item.quantity);
  end loop;
end;
$$;

create or replace function public.consume_inventory_for_order(p_order_id uuid)
returns void
language plpgsql
security definer
set search_path to public, pg_catalog
as $$
declare
  v_reservation public.inventory_reservations%rowtype;
begin
  for v_reservation in
    select * from public.inventory_reservations
    where order_id = p_order_id
    order by product_id
    for update
  loop
    if v_reservation.status = 'consumed' then
      continue;
    elsif v_reservation.status = 'released' then
      raise exception 'Inventory reservation already released for order';
    end if;

    update public.inventory
    set quantity = quantity - v_reservation.quantity,
        reserved_quantity = reserved_quantity - v_reservation.quantity,
        updated_at = now()
    where product_id = v_reservation.product_id
      and quantity >= v_reservation.quantity
      and reserved_quantity >= v_reservation.quantity;

    if not found then
      raise exception 'Inventory reservation cannot be consumed';
    end if;

    update public.inventory_reservations
    set status = 'consumed', updated_at = now()
    where id = v_reservation.id;

    insert into public.inventory_reservation_events(reservation_id,order_id,product_id,event_type,quantity)
    values (v_reservation.id,p_order_id,v_reservation.product_id,'consumed',v_reservation.quantity);
  end loop;
end;
$$;

create or replace function public.release_inventory_for_order(p_order_id uuid)
returns void
language plpgsql
security definer
set search_path to public, pg_catalog
as $$
declare
  v_reservation public.inventory_reservations%rowtype;
begin
  for v_reservation in
    select * from public.inventory_reservations
    where order_id = p_order_id
    order by product_id
    for update
  loop
    if v_reservation.status = 'released' or v_reservation.status = 'consumed' then
      continue;
    end if;

    update public.inventory
    set reserved_quantity = reserved_quantity - v_reservation.quantity,
        updated_at = now()
    where product_id = v_reservation.product_id
      and reserved_quantity >= v_reservation.quantity;

    if not found then
      raise exception 'Inventory reservation cannot be released';
    end if;

    update public.inventory_reservations
    set status = 'released', updated_at = now()
    where id = v_reservation.id;

    insert into public.inventory_reservation_events(reservation_id,order_id,product_id,event_type,quantity)
    values (v_reservation.id,p_order_id,v_reservation.product_id,'released',v_reservation.quantity);
  end loop;
end;
$$;

create or replace function public.apply_order_inventory_transition()
returns trigger
language plpgsql
security definer
set search_path to public, pg_catalog
as $$
begin
  if new.status = old.status then
    return new;
  end if;

  if new.status = 'fulfilling' then
    perform public.consume_inventory_for_order(new.id);
  elsif new.status in ('cancelled','refunded') then
    perform public.release_inventory_for_order(new.id);
  end if;

  return new;
end;
$$;

drop trigger if exists trg_orders_inventory_transition on public.orders;
create trigger trg_orders_inventory_transition
after update of status on public.orders
for each row
execute function public.apply_order_inventory_transition();

revoke execute on function public.reserve_inventory_for_order(uuid) from public,anon,authenticated;
revoke execute on function public.consume_inventory_for_order(uuid) from public,anon,authenticated;
revoke execute on function public.release_inventory_for_order(uuid) from public,anon,authenticated;
grant execute on function public.reserve_inventory_for_order(uuid) to service_role;
grant execute on function public.consume_inventory_for_order(uuid) to service_role;
grant execute on function public.release_inventory_for_order(uuid) to service_role;

drop function if exists public.checkout_basket(text,uuid,uuid,text,text,text);
create or replace function public.checkout_basket(
  p_customer_external_id text,
  p_order_id uuid,
  p_basket_id uuid,
  p_delivery_method text default 'pickup',
  p_idempotency_key text default null,
  p_request_fingerprint text default null
) returns jsonb
language plpgsql
set search_path to public, pg_catalog
as $$
declare
  v_customer_id uuid;
  v_basket public.baskets%rowtype;
  v_order public.orders%rowtype;
  v_existing_key public.checkout_idempotency_keys%rowtype;
  v_subtotal numeric := 0;
  v_delivery_fee numeric := 0;
  v_currency text;
  v_item record;
  v_inventory public.inventory%rowtype;
  v_items jsonb := '[]'::jsonb;
begin
  if p_delivery_method not in ('pickup','standard','express') then raise exception 'Invalid delivery method'; end if;
  if p_idempotency_key is not null and (btrim(p_idempotency_key) = '' or char_length(p_idempotency_key) > 200) then raise exception 'Invalid idempotency key'; end if;
  if p_idempotency_key is not null and (p_request_fingerprint is null or btrim(p_request_fingerprint) = '') then raise exception 'Idempotency request fingerprint is required'; end if;

  select id into v_customer_id from public.customers where external_customer_id = p_customer_external_id limit 1;
  if v_customer_id is null then raise exception 'Customer not found'; end if;

  if p_idempotency_key is not null then
    insert into public.checkout_idempotency_keys(customer_id,idempotency_key,request_fingerprint)
    values(v_customer_id,btrim(p_idempotency_key),p_request_fingerprint)
    on conflict (customer_id,idempotency_key) do nothing;

    select * into v_existing_key
    from public.checkout_idempotency_keys
    where customer_id=v_customer_id and idempotency_key=btrim(p_idempotency_key)
    for update;

    if v_existing_key.request_fingerprint <> p_request_fingerprint then
      raise exception 'Idempotency key has already been used with a different request';
    end if;

    if v_existing_key.order_id is not null then
      select * into v_order from public.orders where id=v_existing_key.order_id and customer_id=v_customer_id limit 1;
      if v_order.id is null then raise exception 'Idempotent order record is missing'; end if;
      select coalesce(jsonb_agg(jsonb_build_object('productId',oi.product_id,'productName',oi.product_name,'sku',oi.sku,'quantity',oi.quantity,'unitPrice',oi.unit_price,'lineTotal',oi.line_total) order by oi.created_at asc),'[]'::jsonb)
        into v_items from public.order_items oi where oi.order_id=v_order.id;
      return jsonb_build_object('id',v_order.id,'customerId',p_customer_external_id,'status',v_order.status,'deliveryMethod',v_order.delivery_method,'deliveryFee',jsonb_build_object('amountMinor',round(v_order.delivery_fee*100)::integer,'currency',v_order.currency),'subtotal',jsonb_build_object('amountMinor',round(v_order.subtotal*100)::integer,'currency',v_order.currency),'total',jsonb_build_object('amountMinor',round(v_order.total*100)::integer,'currency',v_order.currency),'lines',v_items,'idempotent',true);
    end if;
  end if;

  select * into v_basket from public.baskets where id=p_basket_id and customer_id=v_customer_id and status='active' for update;
  if v_basket.id is null then raise exception 'Basket not found'; end if;
  v_currency:=v_basket.currency;
  if p_delivery_method='standard' then v_delivery_fee:=3; elsif p_delivery_method='express' then v_delivery_fee:=6; end if;

  for v_item in
    select bi.product_id,bi.quantity,bi.unit_price,p.name,p.sku,p.price,p.currency,p.is_active
    from public.basket_items bi
    join public.products p on p.id=bi.product_id
    where bi.basket_id=v_basket.id
    order by bi.product_id
    for update of bi
  loop
    if v_item.quantity<=0 then raise exception 'Invalid basket quantity'; end if;
    if not v_item.is_active then raise exception 'Product unavailable'; end if;
    if v_item.currency<>v_currency or round(v_item.price::numeric,2)<>round(v_item.unit_price::numeric,2) then raise exception 'Basket price is stale'; end if;
    select * into v_inventory from public.inventory where product_id=v_item.product_id for update;
    if v_inventory.product_id is null then raise exception 'Inventory unavailable'; end if;
    if v_inventory.quantity-v_inventory.reserved_quantity<v_item.quantity then raise exception 'Insufficient inventory'; end if;
    v_subtotal:=v_subtotal+(v_item.unit_price*v_item.quantity);
    v_items:=v_items||jsonb_build_object('productId',v_item.product_id,'productName',v_item.name,'sku',v_item.sku,'quantity',v_item.quantity,'unitPrice',v_item.unit_price,'lineTotal',v_item.unit_price*v_item.quantity);
  end loop;

  if jsonb_array_length(v_items)=0 then raise exception 'Basket must contain at least one item'; end if;

  insert into public.orders(id,order_number,customer_id,basket_id,status,payment_status,currency,subtotal,delivery_method,delivery_fee,total)
  values(p_order_id,p_order_id::text,v_customer_id,v_basket.id,'placed','unpaid',v_currency,v_subtotal,p_delivery_method,v_delivery_fee,v_subtotal+v_delivery_fee);

  for v_item in select * from jsonb_to_recordset(v_items) as x("productId" uuid,"productName" text,"sku" text,"quantity" integer,"unitPrice" numeric,"lineTotal" numeric) loop
    insert into public.order_items(order_id,product_id,product_name,sku,quantity,unit_price,line_total)
    values(p_order_id,v_item."productId",v_item."productName",v_item."sku",v_item."quantity",v_item."unitPrice",v_item."lineTotal");
  end loop;

  perform public.reserve_inventory_for_order(p_order_id);

  delete from public.basket_items where basket_id=v_basket.id;
  update public.baskets set status='converted',updated_at=now() where id=v_basket.id;

  if p_idempotency_key is not null then
    update public.checkout_idempotency_keys set order_id=p_order_id,updated_at=now()
    where customer_id=v_customer_id and idempotency_key=btrim(p_idempotency_key);
  end if;

  select * into v_order from public.orders where id=p_order_id;
  return jsonb_build_object('id',v_order.id,'customerId',p_customer_external_id,'status',v_order.status,'deliveryMethod',v_order.delivery_method,'deliveryFee',jsonb_build_object('amountMinor',round(v_order.delivery_fee*100)::integer,'currency',v_order.currency),'subtotal',jsonb_build_object('amountMinor',round(v_order.subtotal*100)::integer,'currency',v_order.currency),'total',jsonb_build_object('amountMinor',round(v_order.total*100)::integer,'currency',v_order.currency),'lines',v_items,'idempotent',false);
end;
$$;

revoke execute on function public.checkout_basket(text,uuid,uuid,text,text,text) from public,anon,authenticated;
grant execute on function public.checkout_basket(text,uuid,uuid,text,text,text) to service_role;
