-- Prevent a repeated checkout request from consuming inventory or duplicating order lines.
-- The order id is generated per checkout request; retries of the same request must be
-- handled by the application layer, while this guard protects accidental duplicate IDs.
create or replace function public.checkout_basket(
  p_customer_external_id text,
  p_order_id uuid,
  p_basket_id uuid
) returns jsonb
language plpgsql
as $$
declare
  v_customer_id uuid;
  v_basket public.baskets%rowtype;
  v_order public.orders%rowtype;
  v_order_total numeric := 0;
  v_currency text;
  v_item record;
  v_inventory public.inventory%rowtype;
  v_items jsonb := '[]'::jsonb;
begin
  select id into v_customer_id
  from public.customers
  where external_customer_id = p_customer_external_id
  limit 1;
  if v_customer_id is null then raise exception 'Customer not found'; end if;

  -- Idempotency guard: if this order id already exists for this customer, return it
  -- without touching inventory or the basket a second time.
  select * into v_order
  from public.orders
  where id = p_order_id and customer_id = v_customer_id
  limit 1;
  if v_order.id is not null then
    select jsonb_agg(jsonb_build_object(
      'productId', oi.product_id,
      'productName', oi.product_name,
      'sku', oi.sku,
      'quantity', oi.quantity,
      'unitPrice', oi.unit_price,
      'lineTotal', oi.line_total
    ) order by oi.created_at asc) into v_items
    from public.order_items oi
    where oi.order_id = v_order.id;
    return jsonb_build_object(
      'id', v_order.id,
      'customerId', p_customer_external_id,
      'status', v_order.status,
      'total', jsonb_build_object('amountMinor', round(v_order.total * 100)::integer, 'currency', v_order.currency),
      'lines', coalesce(v_items, '[]'::jsonb),
      'idempotent', true
    );
  end if;

  select * into v_basket
  from public.baskets
  where id = p_basket_id and customer_id = v_customer_id and status = 'active'
  for update;
  if v_basket.id is null then raise exception 'Basket not found'; end if;

  v_currency := v_basket.currency;
  for v_item in
    select bi.product_id, bi.quantity, bi.unit_price, p.name, p.sku, p.price, p.currency, p.is_active
    from public.basket_items bi
    join public.products p on p.id = bi.product_id
    where bi.basket_id = v_basket.id
    order by bi.created_at asc
    for update of bi
  loop
    if v_item.quantity <= 0 then raise exception 'Invalid basket quantity'; end if;
    if not v_item.is_active then raise exception 'Product unavailable'; end if;
    if v_item.currency <> v_currency or round(v_item.price::numeric, 2) <> round(v_item.unit_price::numeric, 2) then raise exception 'Basket price is stale'; end if;

    select * into v_inventory from public.inventory where product_id = v_item.product_id for update;
    if v_inventory.product_id is null then raise exception 'Inventory unavailable'; end if;
    if v_inventory.quantity - v_inventory.reserved_quantity < v_item.quantity then raise exception 'Insufficient inventory'; end if;

    v_order_total := v_order_total + (v_item.unit_price * v_item.quantity);
    v_items := v_items || jsonb_build_object(
      'productId', v_item.product_id,
      'productName', v_item.name,
      'sku', v_item.sku,
      'quantity', v_item.quantity,
      'unitPrice', v_item.unit_price,
      'lineTotal', v_item.unit_price * v_item.quantity
    );
  end loop;

  if jsonb_array_length(v_items) = 0 then raise exception 'Basket must contain at least one item'; end if;

  insert into public.orders (id, order_number, customer_id, basket_id, status, payment_status, currency, subtotal, total)
  values (p_order_id, p_order_id::text, v_customer_id, v_basket.id, 'placed', 'unpaid', v_currency, v_order_total, v_order_total);

  for v_item in select * from jsonb_to_recordset(v_items) as x("productId" uuid, "quantity" integer)
  loop
    update public.inventory
    set quantity = quantity - v_item."quantity", updated_at = now()
    where product_id = v_item."productId";
  end loop;

  for v_item in select * from jsonb_to_recordset(v_items) as x("productId" uuid, "productName" text, "sku" text, "quantity" integer, "unitPrice" numeric, "lineTotal" numeric)
  loop
    insert into public.order_items (order_id, product_id, product_name, sku, quantity, unit_price, line_total)
    values (p_order_id, v_item."productId", v_item."productName", v_item."sku", v_item."quantity", v_item."unitPrice", v_item."lineTotal");
  end loop;

  delete from public.basket_items where basket_id = v_basket.id;
  update public.baskets set status = 'converted', updated_at = now() where id = v_basket.id;

  select * into v_order from public.orders where id = p_order_id;
  return jsonb_build_object(
    'id', v_order.id,
    'customerId', p_customer_external_id,
    'status', v_order.status,
    'total', jsonb_build_object('amountMinor', round(v_order.total * 100)::integer, 'currency', v_order.currency),
    'lines', v_items,
    'idempotent', false
  );
end;
$$;

revoke execute on function public.checkout_basket(text, uuid, uuid) from public, anon, authenticated;
grant execute on function public.checkout_basket(text, uuid, uuid) to service_role;
