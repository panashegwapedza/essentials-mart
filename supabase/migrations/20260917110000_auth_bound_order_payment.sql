-- Bind privileged order payment execution to the authenticated identity resolved at the API boundary.
-- The API verifies the bearer token, resolves auth_user_id -> customers row, and passes both
-- identities. The database then requires the two to match the same customer before any
-- financial mutation can occur.

drop function if exists public.pay_order_with_buckpay(text,uuid,uuid,text,text,text);

drop function if exists public.pay_order_with_buckpay(text,uuid,uuid,text,text,text,text);

create or replace function public.pay_order_with_buckpay(
  p_customer_external_id text,
  p_auth_user_id uuid,
  p_order_id uuid,
  p_payment_id uuid,
  p_idempotency_key text,
  p_request_fingerprint text,
  p_provider_reference text default null
) returns jsonb
language plpgsql
security definer
set search_path to public,pg_catalog
as $$
declare
  v_customer_id uuid;
  v_customer_auth_user_id uuid;
  v_customer_external_id text;
  v_order public.orders%rowtype;
  v_account public.buckpay_accounts%rowtype;
  v_existing public.order_payments%rowtype;
  v_amount numeric;
  v_ledger_reference text;
begin
  if p_customer_external_id is null or btrim(p_customer_external_id)='' then raise exception 'Customer identity is required'; end if;
  if p_auth_user_id is null then raise exception 'Authenticated user identity is required'; end if;
  if p_idempotency_key is null or btrim(p_idempotency_key)='' or char_length(p_idempotency_key)>200 then raise exception 'Invalid payment idempotency key'; end if;
  if p_request_fingerprint is null or btrim(p_request_fingerprint)='' then raise exception 'Payment request fingerprint is required'; end if;

  select id,auth_user_id,external_customer_id into v_customer_id,v_customer_auth_user_id,v_customer_external_id
  from public.customers where external_customer_id=p_customer_external_id limit 1;
  if v_customer_id is null then raise exception 'Customer not found'; end if;
  if v_customer_auth_user_id is null or v_customer_auth_user_id<>p_auth_user_id then raise exception 'Customer identity is not bound to authenticated user'; end if;
  if v_customer_external_id<>p_auth_user_id::text then raise exception 'Customer external identity is not auth-bound'; end if;

  select * into v_order from public.orders where id=p_order_id and customer_id=v_customer_id for update;
  if v_order.id is null then raise exception 'Order not found'; end if;

  select * into v_existing from public.order_payments where customer_id=v_customer_id and idempotency_key=btrim(p_idempotency_key) for update;
  if v_existing.id is not null then
    if v_existing.request_fingerprint<>p_request_fingerprint then raise exception 'Payment idempotency key has already been used with a different request'; end if;
    return jsonb_build_object('status',v_existing.status,'payment',jsonb_build_object('id',v_existing.id,'orderId',v_existing.order_id,'customerId',v_customer_external_id,'paymentMethod',v_existing.payment_method,'amount',v_existing.amount,'currency',v_existing.currency,'status',v_existing.status,'idempotencyKey',v_existing.idempotency_key,'providerReference',v_existing.provider_reference,'createdAt',v_existing.created_at),'idempotent',true);
  end if;

  select * into v_existing from public.order_payments where order_id=v_order.id and payment_method='buckpay' and status='succeeded' limit 1;
  if v_existing.id is not null then
    return jsonb_build_object('status',v_existing.status,'payment',jsonb_build_object('id',v_existing.id,'orderId',v_existing.order_id,'customerId',v_customer_external_id,'paymentMethod',v_existing.payment_method,'amount',v_existing.amount,'currency',v_existing.currency,'status',v_existing.status,'idempotencyKey',v_existing.idempotency_key,'providerReference',v_existing.provider_reference,'createdAt',v_existing.created_at),'idempotent',true);
  end if;
  if v_order.payment_status='paid' then raise exception 'Order is already paid'; end if;
  if v_order.payment_status='refunded' then raise exception 'Order has already been refunded'; end if;

  v_amount:=v_order.total;
  select * into v_account from public.buckpay_accounts where customer_id=v_customer_id for update;
  if v_account.id is null then raise exception 'BuckPay account not found'; end if;
  if v_account.status<>'active' then raise exception 'BuckPay account is suspended'; end if;
  if v_account.currency<>v_order.currency then raise exception 'BuckPay account uses %',v_account.currency; end if;
  if v_account.balance<v_amount then raise exception 'Insufficient BuckPay balance'; end if;

  insert into public.order_payments(id,order_id,customer_id,payment_method,amount,currency,status,idempotency_key,request_fingerprint,provider_reference)
  values(p_payment_id,v_order.id,v_customer_id,'buckpay',v_amount,v_order.currency,'pending',btrim(p_idempotency_key),p_request_fingerprint,p_provider_reference);
  v_ledger_reference:='order-payment:'||v_order.id::text;
  insert into public.buckpay_ledger(id,account_id,transaction_type,amount,currency,reference_type,reference_id,reference,description,created_at)
  values(gen_random_uuid(),v_account.id,'commerce_redemption',v_amount,v_order.currency,'order_payment',v_order.id,v_ledger_reference,'Order payment',now());
  update public.buckpay_accounts set balance=balance-v_amount,updated_at=now() where id=v_account.id;
  update public.order_payments set status='succeeded',updated_at=now() where id=p_payment_id;
  update public.orders set payment_status='paid',status='paid',updated_at=now() where id=v_order.id;
  return jsonb_build_object('status','succeeded','payment',jsonb_build_object('id',p_payment_id,'orderId',v_order.id,'customerId',v_customer_external_id,'paymentMethod','buckpay','amount',v_amount,'currency',v_order.currency,'status','succeeded','idempotencyKey',btrim(p_idempotency_key),'providerReference',p_provider_reference,'createdAt',now()),'idempotent',false);
end;
$$;

revoke execute on function public.pay_order_with_buckpay(text,uuid,uuid,uuid,text,text,text) from public,anon,authenticated;
grant execute on function public.pay_order_with_buckpay(text,uuid,uuid,uuid,text,text,text) to service_role;
