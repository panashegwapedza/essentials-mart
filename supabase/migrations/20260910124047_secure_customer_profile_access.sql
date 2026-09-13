grant select, update on public.customers to authenticated;
drop policy if exists "customers_select_own" on public.customers;
create policy "customers_select_own" on public.customers for select to authenticated using (auth_user_id = (select auth.uid()));
drop policy if exists "customers_update_own" on public.customers;
create policy "customers_update_own" on public.customers for update to authenticated using (auth_user_id = (select auth.uid())) with check (auth_user_id = (select auth.uid()));
