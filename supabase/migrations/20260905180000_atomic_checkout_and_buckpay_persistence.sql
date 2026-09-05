alter table public.orders drop constraint if exists orders_status_check;
alter table public.orders add constraint orders_status_check check (status = any (array['placed','pending','confirmed','paid','fulfilling','fulfilled','cancelled','refunded']));

alter table public.buckpay_ledger add column if not exists reference text;
update public.buckpay_ledger
set reference = coalesce(reference, case when reference_id is not null then reference_type || ':' || reference_id::text else id::text end)
where reference is null;
alter table public.buckpay_ledger alter column reference set not null;
create unique index if not exists uq_buckpay_ledger_account_reference on public.buckpay_ledger(account_id, reference);
create index if not exists idx_buckpay_ledger_account_created on public.buckpay_ledger(account_id, created_at desc);

create or replace function public.buckpay_append_transaction(
  p_customer_external_id text,
  p_transaction_id uuid,
  p_transaction_type text,
  p_amount numeric,
  p_currency text,
  p_reference text,
  p_created_at timestamptz
) returns jsonb
language plpgsql
as $$
declare
  v_customer_id uuid;
  v_account public.buckpay_accounts%rowtype;
  v_existing public.buckpay_ledger%rowtype;
  v_signed numeric;
begin
  if p_customer_external_id is null or btrim(p_customer_external_id) = '' then raise exception 'Customer identity is required'; end if;
  if p_amount <= 0 then raise exception 'Amount must be positive'; end if;
  if p_currency is null or btrim(p_currency) = '' then raise exception 'Currency is required'; end if;
  if p_reference is null or btrim(p_reference) = '' then raise exception 'Transaction reference is required'; end if;
  if p_transaction_type not in ('earned_reward','customer_funding','commerce_redemption','reversal') then raise exception 'Invalid BuckPay transaction type'; end if;

  select id into v_customer_id from public.customers where external_customer_id = p_customer_external_id limit 1;
  if v_customer_id is null then
    insert into public.customers (external_customer_id) values (p_customer_external_id) returning id into v_customer_id;
  end if;

  insert into public.buckpay_accounts (customer_id, currency, balance, status)
  values (v_customer_id, p_currency, 0, 'active')
  on conflict (customer_id) do nothing;

  select * into v_account from public.buckpay_accounts where customer_id = v_customer_id for update;

  if v_account.status <> 'active' then raise exception 'BuckPay account is suspended'; end if;
  if v_account.currency <> p_currency then raise exception 'BuckPay account uses %', v_account.currency; end if;

  select * into v_existing from public.buckpay_ledger where account_id = v_account.id and reference = p_reference limit 1;
  if v_existing.id is not null then
    if v_existing.transaction_type = p_transaction_type and v_existing.amount = p_amount and v_existing.currency = p_currency then
      return jsonb_build_object('status','existing','transaction',jsonb_build_object('id',v_existing.id,'customerId',p_customer_external_id,'type',v_existing.transaction_type,'amount',v_existing.amount,'currency',v_existing.currency,'reference',v_existing.reference,'createdAt',v_existing.created_at));
    end if;
    raise exception 'Transaction reference has already been used';
  end if;

  v_signed := case when p_transaction_type = 'commerce_redemption' then -p_amount else p_amount end;
  if v_account.balance + v_signed < 0 then raise exception 'Insufficient BuckPay balance'; end if;

  update public.buckpay_accounts
  set balance = balance + v_signed, updated_at = now()
  where id = v_account.id;

  insert into public.buckpay_ledger (id, account_id, transaction_type, amount, currency, reference_type, reference_id, reference, description, created_at)
  values (p_transaction_id, v_account.id, p_transaction_type, p_amount, p_currency, 'buckpay', null, p_reference, null, coalesce(p_created_at, now()));

  return jsonb_build_object('status','created','transaction',jsonb_build_object('id',p_transaction_id,'customerId',p_customer_external_id,'type',p_transaction_type,'amount',p_amount,'currency',p_currency,'reference',p_reference,'createdAt',coalesce(p_created_at,now())));
end;
$$;

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
  v_order_total numeric := 0;
  v_currency text;
  v_item record;
  v_inventory public.inventory%rowtype;
  v_order public.orders%rowtype;
  v_items jsonb := '[]'::jsonb;
begin
  select id into v_customer_id from public.customers where external_customer_id = p_customer_external_id limit 1;
  if v_customer_id is null then raise exception 'Customer not found'; end if;

  select * into v_basket from public.baskets where id = p_basket_id and customer_id = v_customer_id and status = 'active' for update;
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
    if v_item.currency <> v_currency or round(v_item.price::numeric,2) <> round(v_item.unit_price::numeric,2) then raise exception 'Basket price is stale'; end if;

    select * into v_inventory from public.inventory where product_id = v_item.product_id for update;
    if v_inventory.product_id is null then raise exception 'Inventory unavailable'; end if;
    if v_inventory.quantity - v_inventory.reserved_quantity < v_item.quantity then raise exception 'Insufficient inventory'; end if;

    v_order_total := v_order_total + (v_item.unit_price * v_item.quantity);
    v_items := v_items || jsonb_build_object('productId',v_item.product_id,'productName',v_item.name,'sku',v_item.sku,'quantity',v_item.quantity,'unitPrice',v_item.unit_price,'lineTotal',v_item.unit_price*v_item.quantity);
  end loop;

  if jsonb_array_length(v_items) = 0 then raise exception 'Basket must contain at least one item'; end if;

  insert into public.orders (id, order_number, customer_id, basket_id, status, payment_status, currency, subtotal, total)
  values (p_order_id, p_order_id::text, v_customer_id, v_basket.id, 'placed', 'unpaid', v_currency, v_order_total, v_order_total)
  on conflict (id) do nothing;

  for v_item in select * from jsonb_to_recordset(v_items) as x("productId" uuid, "quantity" integer)
  loop
    update public.inventory
    set quantity = quantity - v_item."quantity", updated_at = now()
    where product_id = v_item."productId";
  end loop;

  for v_item in select * from jsonb_to_recordset(v_items) as x("productId" uuid, "productName" text, "sku" text, "quantity" integer, "unitPrice" numeric, "lineTotal" numeric)
  loop
    insert into public.order_items (order_id, product_id, product_name, sku, quantity, unit_price, line_total)
    values (p_order_id, v_item."productId", v_item."productName", v_item."sku", v_item."quantity", v_item."unitPrice", v_item."lineTotal")
    on conflict do nothing;
  end loop;

  delete from public.basket_items where basket_id = v_basket.id;
  update public.baskets set status = 'converted', updated_at = now() where id = v_basket.id;

  select * into v_order from public.orders where id = p_order_id;
  return jsonb_build_object('id',v_order.id,'customerId',p_customer_external_id,'status',v_order.status,'total',jsonb_build_object('amountMinor',round(v_order.total*100)::integer,'currency',v_order.currency),'lines',v_items);
end;
$$;

revoke execute on function public.buckpay_append_transaction(text,uuid,text,numeric,text,text,timestamptz) from public, anon, authenticated;
revoke execute on function public.checkout_basket(text,uuid,uuid) from public, anon, authenticated;
grant execute on function public.buckpay_append_transaction(text,uuid,text,numeric,text,text,timestamptz) to service_role;
grant execute on function public.checkout_basket(text,uuid,uuid) to service_role;
