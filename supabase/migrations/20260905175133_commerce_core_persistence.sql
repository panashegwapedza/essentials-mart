create extension if not exists pgcrypto;

create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  sku text not null unique,
  name text not null,
  description text,
  category text,
  price numeric(12,2) not null check (price >= 0),
  currency text not null default 'USD',
  image_url text,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.inventory (
  product_id uuid primary key references public.products(id) on delete cascade,
  quantity integer not null default 0 check (quantity >= 0),
  reserved_quantity integer not null default 0 check (reserved_quantity >= 0 and reserved_quantity <= quantity),
  updated_at timestamptz not null default now()
);

create table if not exists public.customers (
  id uuid primary key default gen_random_uuid(),
  auth_user_id uuid unique,
  email text,
  display_name text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.baskets (
  id uuid primary key default gen_random_uuid(),
  customer_id uuid references public.customers(id) on delete set null,
  status text not null default 'active' check (status in ('active','converted','abandoned')),
  currency text not null default 'USD',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.basket_items (
  id uuid primary key default gen_random_uuid(),
  basket_id uuid not null references public.baskets(id) on delete cascade,
  product_id uuid not null references public.products(id),
  quantity integer not null check (quantity > 0),
  unit_price numeric(12,2) not null check (unit_price >= 0),
  created_at timestamptz not null default now(),
  unique (basket_id, product_id)
);

create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  order_number text not null unique,
  customer_id uuid references public.customers(id) on delete set null,
  basket_id uuid references public.baskets(id) on delete set null,
  status text not null default 'pending' check (status in ('pending','confirmed','paid','fulfilling','fulfilled','cancelled','refunded')),
  payment_status text not null default 'unpaid' check (payment_status in ('unpaid','pending','paid','failed','refunded')),
  currency text not null default 'USD',
  subtotal numeric(12,2) not null default 0 check (subtotal >= 0),
  total numeric(12,2) not null default 0 check (total >= 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  product_id uuid references public.products(id) on delete set null,
  product_name text not null,
  sku text,
  quantity integer not null check (quantity > 0),
  unit_price numeric(12,2) not null check (unit_price >= 0),
  line_total numeric(12,2) not null check (line_total >= 0),
  created_at timestamptz not null default now()
);

create table if not exists public.buckpay_accounts (
  id uuid primary key default gen_random_uuid(),
  customer_id uuid not null unique references public.customers(id) on delete cascade,
  currency text not null default 'USD',
  balance numeric(18,2) not null default 0 check (balance >= 0),
  status text not null default 'active' check (status in ('active','suspended','closed')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.buckpay_ledger (
  id uuid primary key default gen_random_uuid(),
  account_id uuid not null references public.buckpay_accounts(id) on delete cascade,
  transaction_type text not null,
  amount numeric(18,2) not null check (amount <> 0),
  currency text not null default 'USD',
  reference_type text,
  reference_id uuid,
  description text,
  created_at timestamptz not null default now()
);

create table if not exists public.commerce_events (
  id uuid primary key default gen_random_uuid(),
  event_type text not null,
  aggregate_type text not null,
  aggregate_id uuid,
  actor_id uuid,
  payload jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists idx_products_active on public.products(is_active);
create index if not exists idx_inventory_product on public.inventory(product_id);
create index if not exists idx_baskets_customer on public.baskets(customer_id);
create index if not exists idx_basket_items_basket on public.basket_items(basket_id);
create index if not exists idx_orders_customer on public.orders(customer_id);
create index if not exists idx_orders_created on public.orders(created_at desc);
create index if not exists idx_order_items_order on public.order_items(order_id);
create index if not exists idx_buckpay_ledger_account on public.buckpay_ledger(account_id, created_at desc);
create index if not exists idx_commerce_events_aggregate on public.commerce_events(aggregate_type, aggregate_id, created_at desc);

alter table public.products enable row level security;
alter table public.inventory enable row level security;
alter table public.customers enable row level security;
alter table public.baskets enable row level security;
alter table public.basket_items enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;
alter table public.buckpay_accounts enable row level security;
alter table public.buckpay_ledger enable row level security;
alter table public.commerce_events enable row level security;

create policy products_public_read on public.products for select using (is_active = true);

create policy customers_self_read on public.customers for select using (auth.uid() = auth_user_id);
create policy customers_self_insert on public.customers for insert with check (auth.uid() = auth_user_id);
create policy customers_self_update on public.customers for update using (auth.uid() = auth_user_id) with check (auth.uid() = auth_user_id);

create policy baskets_self_access on public.baskets for all using (exists (select 1 from public.customers c where c.id = baskets.customer_id and c.auth_user_id = auth.uid())) with check (exists (select 1 from public.customers c where c.id = baskets.customer_id and c.auth_user_id = auth.uid()));
create policy basket_items_self_access on public.basket_items for all using (exists (select 1 from public.baskets b join public.customers c on c.id = b.customer_id where b.id = basket_items.basket_id and c.auth_user_id = auth.uid())) with check (exists (select 1 from public.baskets b join public.customers c on c.id = b.customer_id where b.id = basket_items.basket_id and c.auth_user_id = auth.uid()));

create policy orders_self_read on public.orders for select using (exists (select 1 from public.customers c where c.id = orders.customer_id and c.auth_user_id = auth.uid()));
create policy order_items_self_read on public.order_items for select using (exists (select 1 from public.orders o join public.customers c on c.id = o.customer_id where o.id = order_items.order_id and c.auth_user_id = auth.uid()));

create policy buckpay_account_self_read on public.buckpay_accounts for select using (exists (select 1 from public.customers c where c.id = buckpay_accounts.customer_id and c.auth_user_id = auth.uid()));
create policy buckpay_ledger_self_read on public.buckpay_ledger for select using (exists (select 1 from public.buckpay_accounts a join public.customers c on c.id = a.customer_id where a.id = buckpay_ledger.account_id and c.auth_user_id = auth.uid()));

create policy commerce_events_self_read on public.commerce_events for select using (actor_id = auth.uid());
