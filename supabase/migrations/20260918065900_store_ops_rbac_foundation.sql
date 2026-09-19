-- Store/Ops authorization foundation.
-- Customer authorization remains separate from operational authority.
-- Staff roles are bound to Supabase Auth identities and scoped to stores.
-- Privileged membership writes are intentionally not exposed to clients.

create type public.store_staff_role as enum (
  'store_operator',
  'fulfilment_operator',
  'store_manager',
  'enterprise_admin'
);

create type public.store_status as enum ('active','inactive');

create table public.stores (
  id uuid primary key default gen_random_uuid(),
  code text not null unique,
  name text not null,
  status public.store_status not null default 'active',
  region text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint stores_code_format check (code = upper(code) and char_length(code) between 2 and 32),
  constraint stores_name_nonempty check (char_length(btrim(name)) between 1 and 200)
);

create table public.store_staff (
  id uuid primary key default gen_random_uuid(),
  store_id uuid not null references public.stores(id) on delete cascade,
  auth_user_id uuid not null references auth.users(id) on delete cascade,
  role public.store_staff_role not null,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (store_id, auth_user_id)
);

create index store_staff_auth_user_idx on public.store_staff(auth_user_id);
create index store_staff_store_role_idx on public.store_staff(store_id, role) where active = true;

alter table public.stores enable row level security;
alter table public.store_staff enable row level security;

create policy store_staff_self_read on public.store_staff
  for select to authenticated
  using (auth_user_id = (select auth.uid()));

create policy stores_assigned_read on public.stores
  for select to authenticated
  using (
    exists (
      select 1 from public.store_staff ss
      where ss.store_id = stores.id
        and ss.auth_user_id = (select auth.uid())
        and ss.active = true
    )
  );

create or replace function private.has_store_role(
  p_store_id uuid,
  p_roles public.store_staff_role[]
) returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.store_staff ss
    where ss.store_id = p_store_id
      and ss.auth_user_id = (select auth.uid())
      and ss.active = true
      and ss.role = any(p_roles)
  );
$$;

revoke execute on function private.has_store_role(uuid, public.store_staff_role[]) from public, anon, authenticated;
grant execute on function private.has_store_role(uuid, public.store_staff_role[]) to authenticated;

create or replace function private.is_store_staff(
  p_store_id uuid
) returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1 from public.store_staff ss
    where ss.store_id = p_store_id
      and ss.auth_user_id = (select auth.uid())
      and ss.active = true
  );
$$;

revoke execute on function private.is_store_staff(uuid) from public, anon, authenticated;
grant execute on function private.is_store_staff(uuid) to authenticated;
