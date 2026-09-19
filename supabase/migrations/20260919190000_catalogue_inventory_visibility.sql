-- Keep development starter products out of the production retail catalogue.
update public.products
set is_active = false,
    updated_at = now()
where sku in ('DEV-BREAD', 'DEV-EGGS', 'DEV-MILK');

-- Ensure the production catalogue has one canonical active row per seeded retail SKU.
create unique index if not exists products_active_sku_unique
  on public.products (sku)
  where is_active = true;