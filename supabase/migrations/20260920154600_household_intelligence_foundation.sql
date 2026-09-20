-- Household Intelligence foundation
-- Establishes household ownership, membership, preferences, shared shopping lists,
-- and pantry state without making AI-derived data authoritative.

create schema if not exists private;

create table if not exists public.households (
  id uuid primary key default gen_random_uuid(),
  status text not null default 'active' check (status in ('active','archived')),
  name text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  version bigint not null default 0 check (version >= 0)
);

create table if not exists public.household_memberships (
  id uuid primary key default gen_random_uuid(),
  household_id uuid not null references public.households(id) on delete cascade,
  customer_id uuid not null references public.customers(id) on delete cascade,
  role text not null default 'member' check (role in ('owner','member','dependent')),
  status text not null default 'active' check (status in ('active','invited','removed')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (household_id, customer_id)
);

create table if not exists public.household_preferences (
  household_id uuid primary key references public.households(id) on delete cascade,
  currency text not null default 'USD',
  locale text,
  timezone text,
  dietary_preferences jsonb not null default '[]'::jsonb,
  shopping_preferences jsonb not null default '{}'::jsonb,
  notification_preferences jsonb not null default '{}'::jsonb,
  budget_preferences jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

create table if not exists public.household_shopping_lists (
  id uuid primary key default gen_random_uuid(),
  household_id uuid not null references public.households(id) on delete cascade,
  name text not null,
  status text not null default 'active' check (status in ('active','completed','archived')),
  created_by_customer_id uuid references public.customers(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  version bigint not null default 0 check (version >= 0)
);

create table if not exists public.household_shopping_list_items (
  id uuid primary key default gen_random_uuid(),
  shopping_list_id uuid not null references public.household_shopping_lists(id) on delete cascade,
  product_id uuid references public.products(id) on delete set null,
  requested_name text,
  quantity integer not null default 1 check (quantity > 0),
  status text not null default 'open' check (status in ('open','added_to_basket','purchased','removed')),
  source text not null default 'manual' check (source in ('manual','recurring','recommendation','ai')),
  added_by_customer_id uuid references public.customers(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (product_id is not null or nullif(btrim(requested_name),'') is not null)
);

create table if not exists public.household_pantry_items (
  id uuid primary key default gen_random_uuid(),
  household_id uuid not null references public.households(id) on delete cascade,
  product_id uuid references public.products(id) on delete set null,
  product_name text not null,
  quantity numeric not null default 0 check (quantity >= 0),
  unit text,
  status text not null default 'available' check (status in ('available','low','depleted')),
  source text not null default 'manual' check (source in ('manual','purchase','inferred','ai')),
  last_confirmed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create or replace function private.is_household_member(p_household_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public, pg_catalog
as $$
  select exists (
    select 1
    from public.household_memberships hm
    join public.customers c on c.id = hm.customer_id
    where hm.household_id = p_household_id
      and hm.status = 'active'
      and c.auth_user_id = (select auth.uid())
  );
$$;

revoke all on function private.is_household_member(uuid) from public, anon;
grant execute on function private.is_household_member(uuid) to authenticated;

create index if not exists household_memberships_household_status_idx on public.household_memberships(household_id, status);
create index if not exists household_memberships_customer_status_idx on public.household_memberships(customer_id, status);
create index if not exists household_shopping_lists_household_status_idx on public.household_shopping_lists(household_id, status);
create index if not exists household_shopping_list_items_list_status_idx on public.household_shopping_list_items(shopping_list_id, status);
create index if not exists household_pantry_items_household_status_idx on public.household_pantry_items(household_id, status);
create index if not exists household_pantry_items_product_idx on public.household_pantry_items(product_id);

alter table public.households enable row level security;
alter table public.household_memberships enable row level security;
alter table public.household_preferences enable row level security;
alter table public.household_shopping_lists enable row level security;
alter table public.household_shopping_list_items enable row level security;
alter table public.household_pantry_items enable row level security;

revoke all on public.households, public.household_memberships, public.household_preferences,
  public.household_shopping_lists, public.household_shopping_list_items, public.household_pantry_items
  from anon;

grant select, insert, update, delete on public.households, public.household_memberships, public.household_preferences,
  public.household_shopping_lists, public.household_shopping_list_items, public.household_pantry_items
  to authenticated;

drop policy if exists households_member_select on public.households;
create policy households_member_select on public.households
for select to authenticated
using (private.is_household_member(id));

drop policy if exists households_member_update on public.households;
create policy households_member_update on public.households
for update to authenticated
using (
  private.is_household_member(id)
  and exists (
    select 1 from public.household_memberships hm
    join public.customers c on c.id = hm.customer_id
    where hm.household_id = households.id
      and hm.status = 'active'
      and hm.role = 'owner'
      and c.auth_user_id = (select auth.uid())
  )
)
with check (private.is_household_member(id));

drop policy if exists household_memberships_member_select on public.household_memberships;
create policy household_memberships_member_select on public.household_memberships
for select to authenticated
using (private.is_household_member(household_id));

drop policy if exists household_memberships_owner_write on public.household_memberships;
create policy household_memberships_owner_write on public.household_memberships
for all to authenticated
using (
  exists (
    select 1 from public.household_memberships own
    join public.customers c on c.id = own.customer_id
    where own.household_id = household_memberships.household_id
      and own.status = 'active'
      and own.role = 'owner'
      and c.auth_user_id = (select auth.uid())
  )
)
with check (
  exists (
    select 1 from public.household_memberships own
    join public.customers c on c.id = own.customer_id
    where own.household_id = household_memberships.household_id
      and own.status = 'active'
      and own.role = 'owner'
      and c.auth_user_id = (select auth.uid())
  )
);

drop policy if exists household_preferences_member_access on public.household_preferences;
create policy household_preferences_member_access on public.household_preferences
for all to authenticated
using (private.is_household_member(household_id))
with check (private.is_household_member(household_id));

drop policy if exists household_shopping_lists_member_access on public.household_shopping_lists;
create policy household_shopping_lists_member_access on public.household_shopping_lists
for all to authenticated
using (private.is_household_member(household_id))
with check (private.is_household_member(household_id));

drop policy if exists household_shopping_list_items_member_access on public.household_shopping_list_items;
create policy household_shopping_list_items_member_access on public.household_shopping_list_items
for all to authenticated
using (
  exists (
    select 1 from public.household_shopping_lists sl
    where sl.id = household_shopping_list_items.shopping_list_id
      and private.is_household_member(sl.household_id)
  )
)
with check (
  exists (
    select 1 from public.household_shopping_lists sl
    where sl.id = household_shopping_list_items.shopping_list_id
      and private.is_household_member(sl.household_id)
  )
);

drop policy if exists household_pantry_items_member_access on public.household_pantry_items;
create policy household_pantry_items_member_access on public.household_pantry_items
for all to authenticated
using (private.is_household_member(household_id))
with check (private.is_household_member(household_id));
