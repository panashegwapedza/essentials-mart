alter table public.customers add column if not exists external_customer_id text;
create unique index if not exists idx_customers_external_customer_id on public.customers(external_customer_id) where external_customer_id is not null;
