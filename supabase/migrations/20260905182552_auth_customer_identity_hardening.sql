create unique index if not exists customers_auth_user_id_unique on public.customers(auth_user_id) where auth_user_id is not null;

create or replace function public.current_customer_id()
returns uuid
language sql
stable
security definer
set search_path = public
as $$
  select id from public.customers where auth_user_id = auth.uid() limit 1;
$$;

revoke all on function public.current_customer_id() from public;
grant execute on function public.current_customer_id() to authenticated;

drop policy if exists customers_self_insert on public.customers;
create policy customers_self_insert on public.customers
for insert to authenticated
with check (auth.uid() = auth_user_id);

drop policy if exists customers_anon_deny on public.customers;
create policy customers_anon_deny on public.customers
for all to anon using (false) with check (false);
