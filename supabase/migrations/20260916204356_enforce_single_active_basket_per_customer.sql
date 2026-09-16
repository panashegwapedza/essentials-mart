create unique index if not exists uq_baskets_one_active_per_customer
  on public.baskets(customer_id)
  where status = 'active' and customer_id is not null;
