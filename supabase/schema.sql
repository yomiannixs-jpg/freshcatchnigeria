create extension if not exists pgcrypto;

create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  reference text unique not null,
  customer_name text,
  customer_phone text,
  customer_email text,
  delivery_address text,
  delivery_zone text,
  delivery_fee numeric default 0,
  payment_method text,
  payment_status text default 'pending',
  amount_ngn numeric default 0,
  items jsonb default '[]'::jsonb,
  status text default 'pending',
  rider_id uuid,
  paystack_reference text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists public.vendors (
  id uuid primary key default gen_random_uuid(),
  name text,
  phone text,
  email text,
  location text,
  specialty text,
  created_at timestamptz default now()
);

create table if not exists public.riders (
  id uuid primary key default gen_random_uuid(),
  name text,
  phone text,
  bike text,
  status text default 'available',
  lat double precision,
  lng double precision,
  last_seen timestamptz,
  created_at timestamptz default now()
);

create table if not exists public.inventory (
  id uuid primary key default gen_random_uuid(),
  vendor_id uuid references public.vendors(id) on delete cascade,
  product_name text,
  quantity numeric default 0,
  unit text,
  unit_price numeric default 0,
  stock_status text default 'in-stock',
  created_at timestamptz default now()
);

create table if not exists public.product_price_lists (
  id uuid primary key default gen_random_uuid(),
  sku text unique not null,
  name text,
  unit text,
  price_ngn numeric,
  price_min_ngn numeric,
  price_max_ngn numeric,
  pricing_type text default 'fixed',
  category text,
  market text default 'Nigeria',
  notes text,
  created_at timestamptz default now()
);

alter table public.orders disable row level security;
alter table public.vendors disable row level security;
alter table public.riders disable row level security;
alter table public.inventory disable row level security;
alter table public.product_price_lists disable row level security;


-- Rider portal note:
-- Rider GPS updates use the public /api/rider-location route.
-- Riders must exist first in public.riders so the portal can update lat/lng/last_seen.


-- FreshCatchNG v2 additions
alter table public.orders add column if not exists packed_at timestamptz;
alter table public.orders add column if not exists assigned_at timestamptz;
alter table public.orders add column if not exists out_for_delivery_at timestamptz;
alter table public.orders add column if not exists delivered_at timestamptz;
alter table public.orders add column if not exists cancelled_at timestamptz;
