create policy inventory_no_direct_client_access on public.inventory for select to anon, authenticated using (false);
revoke execute on function public.rls_auto_enable() from anon, authenticated;
