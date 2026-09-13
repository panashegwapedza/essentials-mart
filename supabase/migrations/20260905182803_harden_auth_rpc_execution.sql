create unique index if not exists customers_external_customer_id_unique on public.customers(external_customer_id) where external_customer_id is not null;

alter function public.buckpay_append_transaction(text, uuid, text, numeric, text, text, timestamptz) set search_path = public;
alter function public.checkout_basket(text, uuid, uuid) set search_path = public;
revoke execute on function public.current_customer_id() from public;
revoke execute on function public.current_customer_id() from anon;
revoke execute on function public.current_customer_id() from authenticated;
revoke execute on function public.rls_auto_enable() from public;
revoke execute on function public.rls_auto_enable() from anon;
revoke execute on function public.rls_auto_enable() from authenticated;
