alter table public.customers add column if not exists phone text;
alter table public.customers add column if not exists address_line1 text;
alter table public.customers add column if not exists address_line2 text;
alter table public.customers add column if not exists city text;
alter table public.customers add column if not exists region text;
alter table public.customers add column if not exists postal_code text;
alter table public.customers add column if not exists country text;
alter table public.customers add column if not exists avatar_url text;
