create table if not exists public.walk_layouts (
  id uuid primary key default gen_random_uuid(), store_id uuid not null references public.stores(id) on delete cascade,
  version integer not null default 1 check (version > 0), status text not null default 'draft' check (status in ('draft','active','retired')),
  created_at timestamptz not null default now(), updated_at timestamptz not null default now(), unique(store_id,version)
);
create unique index if not exists walk_layouts_one_active_per_store on public.walk_layouts(store_id) where status='active';
create table if not exists public.walk_aisles (
  id uuid primary key default gen_random_uuid(), layout_id uuid not null references public.walk_layouts(id) on delete cascade,
  name text not null, department text not null, sort_order integer not null default 0,
  x numeric not null default 0, z numeric not null default 0, width numeric not null default 3 check(width>0), length numeric not null default 18 check(length>0),
  created_at timestamptz not null default now()
);
create table if not exists public.walk_product_positions (
  id uuid primary key default gen_random_uuid(), layout_id uuid not null references public.walk_layouts(id) on delete cascade,
  aisle_id uuid not null references public.walk_aisles(id) on delete cascade, product_id uuid not null references public.products(id) on delete cascade,
  shelf_code text not null default 'A', bay integer not null default 1 check(bay>0),
  position_x numeric not null default 0, position_y numeric not null default 1.2, position_z numeric not null default 0,
  facing integer not null default 1 check(facing>0), status text not null default 'active' check(status in ('active','hidden')),
  unique(layout_id,product_id,shelf_code,bay)
);
create table if not exists public.walk_navigation_nodes (
  id uuid primary key default gen_random_uuid(), layout_id uuid not null references public.walk_layouts(id) on delete cascade,
  node_type text not null check(node_type in ('ENTRANCE','AISLE_ENTRY','AISLE_INTERSECTION','SHELF_APPROACH','CHECKOUT','SERVICE','EXIT')),
  label text, x numeric not null default 0, y numeric not null default 0, z numeric not null default 0,
  status text not null default 'OPEN' check(status in ('OPEN','BLOCKED','RESTRICTED'))
);
create table if not exists public.walk_navigation_edges (
  id uuid primary key default gen_random_uuid(), layout_id uuid not null references public.walk_layouts(id) on delete cascade,
  from_node_id uuid not null references public.walk_navigation_nodes(id) on delete cascade,
  to_node_id uuid not null references public.walk_navigation_nodes(id) on delete cascade,
  distance numeric not null check(distance>=0), traversal_type text not null default 'WALK' check(traversal_type in ('WALK','RESTRICTED')),
  status text not null default 'OPEN' check(status in ('OPEN','BLOCKED','RESTRICTED')), unique(layout_id,from_node_id,to_node_id)
);
create table if not exists public.walk_sessions (
  id uuid primary key default gen_random_uuid(), customer_id uuid not null references public.customers(id) on delete cascade,
  store_id uuid not null references public.stores(id) on delete restrict, layout_id uuid not null references public.walk_layouts(id) on delete restrict,
  layout_version integer not null, mode text not null default 'MANUAL' check(mode in ('MANUAL','AI_ASSISTED','AUTOPILOT')),
  status text not null default 'ACTIVE' check(status in ('ACTIVE','PAUSED','TAKEN_OVER','COMPLETED','CANCELLED')),
  current_node_id uuid references public.walk_navigation_nodes(id) on delete set null, route_id uuid,
  created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
