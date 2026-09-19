-- Expand the durable catalogue into a first-class retail product model.
alter table public.products
  add column if not exists product_family text,
  add column if not exists brand text,
  add column if not exists variant_label text,
  add column if not exists size_label text;

create index if not exists idx_products_category on public.products(category);
create index if not exists idx_products_family on public.products(product_family);
create index if not exists idx_products_brand on public.products(brand);
create index if not exists idx_products_search on public.products using gin (
  to_tsvector('simple', coalesce(name,'') || ' ' || coalesce(brand,'') || ' ' ||
    coalesce(product_family,'') || ' ' || coalesce(variant_label,'') || ' ' ||
    coalesce(size_label,'') || ' ' || coalesce(category,''))
);

-- Turn inventory into store-specific inventory. Existing rows are attached to the
-- first/main store so current stock remains durable during the transition.
alter table public.inventory add column if not exists store_id uuid references public.stores(id) on delete cascade;
do $$
declare first_store uuid;
begin
  select id into first_store from public.stores order by created_at asc limit 1;
  if first_store is not null then
    update public.inventory set store_id=first_store where store_id is null;
  end if;
end $$;

alter table public.inventory alter column store_id set not null;
alter table public.inventory drop constraint if exists inventory_pkey;
alter table public.inventory add primary key (store_id, product_id);
create index if not exists idx_inventory_store_product on public.inventory(store_id, product_id);

-- Seed a small but realistic catalogue. This is intentionally additive and
-- idempotent: existing products are never duplicated.
insert into public.products
  (sku,name,description,category,product_family,brand,variant_label,size_label,price,currency,is_active,image_url)
select v.sku,v.name,v.description,v.category,v.product_family,v.brand,v.variant_label,v.size_label,v.price,v.currency,true,v.image_url
from (values
 ('PANTRY-RICE-001','Rice','Everyday household rice.','Pantry','Rice','Essentials','Long Grain','2 kg',8.50,'USD',null),
 ('HOUSEHOLD-SOAP-001','Bath Soap','Everyday household bath soap.','Household','Bath Soap','Essentials','Classic','125 g',3.25,'USD',null),
 ('PERSONAL-CARE-TOOTHPASTE-001','Toothpaste','Everyday household toothpaste.','Personal Care','Toothpaste','Essentials','Fresh Mint','100 ml',5.75,'USD',null),
 ('PANTRY-COOKING-OIL-001','Cooking Oil','Everyday cooking oil.','Pantry','Cooking Oil','Essentials','Pure Vegetable','2 L',7.90,'USD',null),
 ('PANTRY-SUGAR-001','Sugar','Granulated household sugar.','Pantry','Sugar','Essentials','White Granulated','2 kg',4.80,'USD',null),
 ('PANTRY-FLOUR-001','All Purpose Flour','Everyday baking flour.','Pantry','Flour','Essentials','All Purpose','2 kg',5.40,'USD',null),
 ('DAIRY-MILK-001','Milk','Everyday household milk.','Dairy','Milk','Essentials','Full Cream','1 L',3.00,'USD',null),
 ('BAKERY-BREAD-001','Bread','Fresh everyday bread.','Bakery','Bread','Essentials','White Sliced','700 g',2.50,'USD',null)
) v(sku,name,description,category,product_family,brand,variant_label,size_label,price,currency,image_url)
where not exists (select 1 from public.products p where p.sku=v.sku);

insert into public.inventory (store_id,product_id,quantity,reserved_quantity)
select s.id,p.id,100,0
from public.stores s
cross join public.products p
where s.code='MAIN'
  and p.sku in (
    'PANTRY-RICE-001','HOUSEHOLD-SOAP-001','PERSONAL-CARE-TOOTHPASTE-001',
    'PANTRY-COOKING-OIL-001','PANTRY-SUGAR-001','PANTRY-FLOUR-001',
    'DAIRY-MILK-001','BAKERY-BREAD-001'
  )
  and not exists (select 1 from public.inventory i where i.store_id=s.id and i.product_id=p.id);

-- Give existing starter products the same richer metadata without changing
-- their IDs, prices or customer-visible availability.
update public.products set
  category=case when name='Bread' then 'Bakery' when name='Eggs' then 'Dairy' when name='Milk' then 'Dairy' else category end,
  product_family=case when name='Bread' then 'Bread' when name='Eggs' then 'Eggs' when name='Milk' then 'Milk' else product_family end,
  brand=coalesce(brand,'Essentials'),
  variant_label=case when name='Bread' then 'White Sliced' when name='Eggs' then 'Free Range' when name='Milk' then 'Full Cream' else variant_label end,
  size_label=case when name='Bread' then '700 g' when name='Eggs' then '12 pack' when name='Milk' then '1 L' else size_label end,
  updated_at=now()
where name in ('Bread','Eggs','Milk');

