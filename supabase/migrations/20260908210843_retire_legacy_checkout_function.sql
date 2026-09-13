drop function if exists public.checkout_basket(text, uuid, uuid);
alter function public.checkout_basket(text, uuid, uuid, text) set search_path = public, pg_catalog;
revoke execute on function public.checkout_basket(text, uuid, uuid, text) from public, anon, authenticated;
grant execute on function public.checkout_basket(text, uuid, uuid, text) to service_role;
