-- Fix production checkout store propagation.
-- Orders and deliveries are store-scoped; checkout derives the store from the
-- inventory row(s) in the basket and passes it through operational records.

create or replace function public.ensure_order_operational_records()
returns trigger
language plpgsql
security definer
set search_path to 'public'
as $function$
declare v_notification_id uuid;
begin
  if tg_op = 'INSERT' then
    insert into public.deliveries(order_id,customer_id,method,status,store_id)
    values(new.id,new.customer_id,new.delivery_method,'pending',new.store_id)
    on conflict (order_id) do nothing;

    insert into public.notifications(customer_id,type,title,body,aggregate_type,aggregate_id,action_type,action_target,dedupe_key)
    values(new.customer_id,'order.confirmed','Order confirmed','Your order has been confirmed and is now being prepared.','order',new.id,'open_order','/orders/'||new.id,'order.confirmed:'||new.id)
    on conflict (dedupe_key) do nothing returning id into v_notification_id;

    if v_notification_id is not null then
      insert into public.notification_deliveries(notification_id,channel,status,next_attempt_at) values(v_notification_id,'in_app','sent',now()) on conflict(notification_id,channel) do nothing;
      insert into public.notification_deliveries(notification_id,channel,status,next_attempt_at) values(v_notification_id,'push','pending',now()) on conflict(notification_id,channel) do nothing;
      insert into public.notification_deliveries(notification_id,channel,status,next_attempt_at) values(v_notification_id,'whatsapp','pending',now()) on conflict(notification_id,channel) do nothing;
    end if;
  elsif tg_op='UPDATE' and new.status is distinct from old.status then
    insert into public.notifications(customer_id,type,title,body,aggregate_type,aggregate_id,action_type,action_target,dedupe_key)
    values(new.customer_id,'order.status_changed','Order status updated','Your order is now '||replace(new.status,'_',' ')||'.','order',new.id,'open_order','/orders/'||new.id,'order.status:'||new.id||':'||new.status)
    on conflict(dedupe_key) do nothing returning id into v_notification_id;

    if v_notification_id is not null then
      insert into public.notification_deliveries(notification_id,channel,status,next_attempt_at) values(v_notification_id,'in_app','sent',now()) on conflict(notification_id,channel) do nothing;
      insert into public.notification_deliveries(notification_id,channel,status,next_attempt_at) values(v_notification_id,'push','pending',now()) on conflict(notification_id,channel) do nothing;
      insert into public.notification_deliveries(notification_id,channel,status,next_attempt_at) values(v_notification_id,'whatsapp','pending',now()) on conflict(notification_id,channel) do nothing;
    end if;
  end if;
  return new;
end;
$function$;

create or replace function public.checkout_basket(
  p_customer_external_id text,
  p_order_id uuid,
  p_basket_id uuid,
  p_delivery_method text default 'pickup',
  p_idempotency_key text default null,
  p_request_fingerprint text default null
)
returns jsonb
language plpgsql
set search_path to 'public','pg_catalog'
as $function$
declare
  v_customer_id uuid;
  v_basket public.baskets%rowtype;
  v_order public.orders%rowtype;
  v_existing_key public.checkout_idempotency_keys%rowtype;
  v_subtotal numeric:=0;
  v_delivery_fee numeric:=0;
  v_currency text;
  v_item record;
  v_inventory public.inventory%rowtype;
  v_store_id uuid;
  v_items jsonb:='[]'::jsonb;
begin
  if p_delivery_method not in ('pickup','standard','express') then raise exception 'Invalid delivery method'; end if;
  if p_idempotency_key is not null and (btrim(p_idempotency_key)='' or char_length(p_idempotency_key)>200) then raise exception 'Invalid idempotency key'; end if;
  if p_idempotency_key is not null and (p_request_fingerprint is null or btrim(p_request_fingerprint)='') then raise exception 'Idempotency request fingerprint is required'; end if;

  select id into v_customer_id from public.customers where external_customer_id=p_customer_external_id limit 1;
  if v_customer_id is null then raise exception 'Customer not found'; end if;

  if p_idempotency_key is not null then
    insert into public.checkout_idempotency_keys(customer_id,idempotency_key,request_fingerprint)
    values(v_customer_id,btrim(p_idempotency_key),p_request_fingerprint)
    on conflict (customer_id,idempotency_key) do nothing;
    select * into v_existing_key from public.checkout_idempotency_keys
    where customer_id=v_customer_id and idempotency_key=btrim(p_idempotency_key) for update;
    if v_existing_key.request_fingerprint<>p_request_fingerprint then raise exception 'Idempotency key has already been used with a different request'; end if;
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

  if p_delivery_method='standard' then v_delivery_fee:=3;
  elsif p_delivery_method='express' then v_delivery_fee:=6;
  end if;

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

    if v_store_id is null then
      v_store_id:=v_inventory.store_id;
    elsif v_store_id<>v_inventory.store_id then
      raise exception 'Basket contains products from different stores';
    end if;

    if v_inventory.quantity-v_inventory.reserved_quantity<v_item.quantity then raise exception 'Insufficient inventory'; end if;
    v_subtotal:=v_subtotal+(v_item.unit_price*v_item.quantity);
    v_items:=v_items||jsonb_build_object('productId',v_item.product_id,'productName',v_item.name,'sku',v_item.sku,'quantity',v_item.quantity,'unitPrice',v_item.unit_price,'lineTotal',v_item.unit_price*v_item.quantity);
  end loop;

  if v_store_id is null then raise exception 'Basket must contain at least one item'; end if;
  if jsonb_array_length(v_items)=0 then raise exception 'Basket must contain at least one item'; end if;

  insert into public.orders(id,order_number,customer_id,basket_id,status,payment_status,currency,subtotal,delivery_method,delivery_fee,total,store_id)
  values(p_order_id,p_order_id::text,v_customer_id,v_basket.id,'placed','unpaid',v_currency,v_subtotal,p_delivery_method,v_delivery_fee,v_subtotal+v_delivery_fee,v_store_id);

  for v_item in select * from jsonb_to_recordset(v_items) as x("productId" uuid,"productName" text,"sku" text,"quantity" integer,"unitPrice" numeric,"lineTotal" numeric)
  loop
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
$function$;