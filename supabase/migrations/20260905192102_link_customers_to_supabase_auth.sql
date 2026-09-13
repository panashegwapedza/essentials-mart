alter table public.customers
  add constraint customers_auth_user_id_fkey
  foreign key (auth_user_id) references auth.users(id) on delete set null;

create or replace function public.handle_new_auth_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.customers (auth_user_id, email, display_name)
  values (new.id, new.email, coalesce(new.raw_user_meta_data->>'display_name', new.raw_user_meta_data->>'full_name'))
  on conflict (auth_user_id) do update
    set email = excluded.email,
        display_name = coalesce(excluded.display_name, public.customers.display_name),
        updated_at = now();
  return new;
end;
$$;

drop trigger if exists on_auth_user_created_essentials_mart on auth.users;
create trigger on_auth_user_created_essentials_mart
after insert on auth.users
for each row execute function public.handle_new_auth_user();

create or replace function public.current_customer_id()
returns uuid
language sql
stable
security definer
set search_path = public
as $$
  select id from public.customers where auth_user_id = (select auth.uid()) limit 1;
$$;

revoke all on function public.current_customer_id() from public;
grant execute on function public.current_customer_id() to authenticated;

create policy "customers_select_own" on public.customers
for select to authenticated
using (auth_user_id = (select auth.uid()));

create policy "customers_update_own" on public.customers
for update to authenticated
using (auth_user_id = (select auth.uid()))
with check (auth_user_id = (select auth.uid()));

create policy "baskets_select_own" on public.baskets
for select to authenticated
using (customer_id = public.current_customer_id());

create policy "basket_items_select_own" on public.basket_items
for select to authenticated
using (basket_id in (select id from public.baskets where customer_id = public.current_customer_id()));

create policy "orders_select_own" on public.orders
for select to authenticated
using (customer_id = public.current_customer_id());

create policy "order_items_select_own" on public.order_items
for select to authenticated
using (order_id in (select id from public.orders where customer_id = public.current_customer_id()));

create policy "buckpay_accounts_select_own" on public.buckpay_accounts
for select to authenticated
using (customer_id = public.current_customer_id());

create policy "buckpay_ledger_select_own" on public.buckpay_ledger
for select to authenticated
using (account_id in (select id from public.buckpay_accounts where customer_id = public.current_customer_id()));
