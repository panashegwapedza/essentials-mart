-- Seed the first durable customer catalogue for the main store.
-- This replaces the need for a frontend-only catalogue fallback.

insert into public.products (sku,name,description,category,price,currency,is_active)
select v.sku,v.name,v.description,v.category,v.price,v.currency,true
from (values
  ('PANTRY-RICE-001','Rice','Everyday household rice.','Pantry',8.50,'USD'),
  ('HOUSEHOLD-SOAP-001','Bath Soap','Everyday household bath soap.','Household',3.25,'USD'),
  ('PERSONAL-CARE-TOOTHPASTE-001','Toothpaste','Everyday household toothpaste.','Personal Care',5.75,'USD')
) v(sku,name,description,category,price,currency)
where not exists (select 1 from public.products p where p.sku=v.sku);

insert into public.inventory (product_id,quantity,reserved_quantity,store_id)
select p.id,100,0,s.id
from public.products p
cross join public.stores s
where s.code='MAIN'
  and p.sku in ('PANTRY-RICE-001','HOUSEHOLD-SOAP-001','PERSONAL-CARE-TOOTHPASTE-001')
  and not exists (
    select 1 from public.inventory i
    where i.product_id=p.id and i.store_id=s.id
  );
