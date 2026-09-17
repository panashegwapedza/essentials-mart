drop function if exists public.checkout_basket(text,uuid,uuid,text);
revoke execute on function public.checkout_basket(text,uuid,uuid,text,text,text) from public,anon,authenticated;
grant execute on function public.checkout_basket(text,uuid,uuid,text,text,text) to service_role;
