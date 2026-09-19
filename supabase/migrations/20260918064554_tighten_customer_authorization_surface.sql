-- Tighten customer-facing RLS policies to authenticated users only.
-- The previous policies used the public role with auth.uid() predicates.
-- Anonymous requests could not pass those predicates, but the public target
-- unnecessarily widened the policy surface. Canonicalize all customer policies
-- onto the authenticated role and preserve ownership through auth_user_id.

drop policy if exists basket_items_select_own on public.basket_items;
drop policy if exists basket_items_self_access on public.basket_items;
create policy basket_items_customer_select on public.basket_items
  for select to authenticated
  using (exists (select 1 from public.baskets b join public.customers c on c.id=b.customer_id where b.id=basket_items.basket_id and c.auth_user_id=(select auth.uid())));

create policy basket_items_customer_insert on public.basket_items
  for insert to authenticated
  with check (exists (select 1 from public.baskets b join public.customers c on c.id=b.customer_id where b.id=basket_items.basket_id and c.auth_user_id=(select auth.uid())));

create policy basket_items_customer_update on public.basket_items
  for update to authenticated
  using (exists (select 1 from public.baskets b join public.customers c on c.id=b.customer_id where b.id=basket_items.basket_id and c.auth_user_id=(select auth.uid())))
  with check (exists (select 1 from public.baskets b join public.customers c on c.id=b.customer_id where b.id=basket_items.basket_id and c.auth_user_id=(select auth.uid())));

create policy basket_items_customer_delete on public.basket_items
  for delete to authenticated
  using (exists (select 1 from public.baskets b join public.customers c on c.id=b.customer_id where b.id=basket_items.basket_id and c.auth_user_id=(select auth.uid())));

drop policy if exists baskets_select_own on public.baskets;
drop policy if exists baskets_self_access on public.baskets;
create policy baskets_customer_select on public.baskets for select to authenticated using (customer_id=(select id from public.customers where auth_user_id=(select auth.uid())));
create policy baskets_customer_insert on public.baskets for insert to authenticated with check (customer_id=(select id from public.customers where auth_user_id=(select auth.uid())));
create policy baskets_customer_update on public.baskets for update to authenticated using (customer_id=(select id from public.customers where auth_user_id=(select auth.uid()))) with check (customer_id=(select id from public.customers where auth_user_id=(select auth.uid())));
create policy baskets_customer_delete on public.baskets for delete to authenticated using (customer_id=(select id from public.customers where auth_user_id=(select auth.uid())));

drop policy if exists buckpay_account_self_read on public.buckpay_accounts;
drop policy if exists buckpay_accounts_select_own on public.buckpay_accounts;
create policy buckpay_accounts_customer_select on public.buckpay_accounts for select to authenticated using (customer_id=(select id from public.customers where auth_user_id=(select auth.uid())));

drop policy if exists buckpay_ledger_select_own on public.buckpay_ledger;
drop policy if exists buckpay_ledger_self_read on public.buckpay_ledger;
create policy buckpay_ledger_customer_select on public.buckpay_ledger for select to authenticated using (exists (select 1 from public.buckpay_accounts a where a.id=buckpay_ledger.account_id and a.customer_id=(select id from public.customers where auth_user_id=(select auth.uid()))));

drop policy if exists commerce_events_self_read on public.commerce_events;
create policy commerce_events_customer_select on public.commerce_events for select to authenticated using (actor_id=(select auth.uid()));

drop policy if exists customers_self_read on public.customers;
drop policy if exists customers_self_update on public.customers;
drop policy if exists customers_select_own on public.customers;
drop policy if exists customers_update_own on public.customers;
create policy customers_customer_select on public.customers for select to authenticated using (auth_user_id=(select auth.uid()));
create policy customers_customer_update on public.customers for update to authenticated using (auth_user_id=(select auth.uid())) with check (auth_user_id=(select auth.uid()));
drop policy if exists customers_self_insert on public.customers;
create policy customers_customer_insert on public.customers for insert to authenticated with check (auth_user_id=(select auth.uid()));

drop policy if exists order_items_select_own on public.order_items;
drop policy if exists order_items_self_read on public.order_items;
create policy order_items_customer_select on public.order_items for select to authenticated using (exists (select 1 from public.orders o join public.customers c on c.id=o.customer_id where o.id=order_items.order_id and c.auth_user_id=(select auth.uid())));

drop policy if exists orders_select_own on public.orders;
drop policy if exists orders_self_read on public.orders;
create policy orders_customer_select on public.orders for select to authenticated using (customer_id=(select id from public.customers where auth_user_id=(select auth.uid())));

drop policy if exists payment_transactions_customer_select on public.payment_transactions;
create policy payment_transactions_customer_select on public.payment_transactions for select to authenticated using (customer_id=(select id from public.customers where auth_user_id=(select auth.uid())));

drop policy if exists deliveries_customer_select on public.deliveries;
create policy deliveries_customer_select on public.deliveries for select to authenticated using (customer_id=(select id from public.customers where auth_user_id=(select auth.uid())));

drop policy if exists delivery_status_history_customer_select on public.delivery_status_history;
create policy delivery_status_history_customer_select on public.delivery_status_history for select to authenticated using (customer_id=(select id from public.customers where auth_user_id=(select auth.uid())));

drop policy if exists notifications_customer_select on public.notifications;
drop policy if exists notifications_customer_update on public.notifications;
create policy notifications_customer_select on public.notifications for select to authenticated using (customer_id=(select id from public.customers where auth_user_id=(select auth.uid())));
create policy notifications_customer_update on public.notifications for update to authenticated using (customer_id=(select id from public.customers where auth_user_id=(select auth.uid()))) with check (customer_id=(select id from public.customers where auth_user_id=(select auth.uid())));

drop policy if exists notification_deliveries_customer_select on public.notification_deliveries;
create policy notification_deliveries_customer_select on public.notification_deliveries for select to authenticated using (exists (select 1 from public.notifications n where n.id=notification_deliveries.notification_id and n.customer_id=(select id from public.customers where auth_user_id=(select auth.uid()))));
