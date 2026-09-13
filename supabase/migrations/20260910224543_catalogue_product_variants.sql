alter table public.products
  add column if not exists product_family text,
  add column if not exists brand text,
  add column if not exists variant_label text,
  add column if not exists size_label text;

create index if not exists idx_products_family_brand_active
  on public.products (product_family, brand, is_active);

create index if not exists idx_products_category_active
  on public.products (category, is_active);
