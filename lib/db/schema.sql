create extension if not exists "pgcrypto";

create table if not exists users (
  id uuid primary key default gen_random_uuid(),
  auth_user_id uuid unique,
  email text unique,
  display_name text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists products (
  id uuid primary key default gen_random_uuid(),
  code text not null unique,
  name text not null,
  description text,
  price_cents integer not null default 0,
  currency text not null default 'USD',
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists readings (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references users(id) on delete set null,
  question text not null,
  question_type text not null,
  spread_key text not null,
  cards jsonb not null,
  report_preview jsonb,
  report_full jsonb,
  payment_status text not null default 'locked',
  unlocked_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists orders (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references users(id) on delete set null,
  reading_id uuid references readings(id) on delete set null,
  product_id uuid references products(id) on delete set null,
  product_code text,
  payment_provider text,
  payment_channel text,
  provider_order_id text,
  provider_payload jsonb,
  payment_status text not null default 'pending',
  amount_cents integer not null default 0,
  currency text not null default 'USD',
  paid_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists redemption_codes (
  id uuid primary key default gen_random_uuid(),
  code text not null unique,
  code_normalized text not null unique,
  product_code text not null default 'full-reading',
  source_platform text,
  status text not null default 'available',
  order_id uuid references orders(id) on delete set null,
  reading_id uuid references readings(id) on delete set null,
  notes text,
  expires_at timestamptz,
  redeemed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

insert into products (code, name, description, price_cents, currency)
values ('full-reading', '完整解读', '解锁更完整的塔罗解读内容', 299, 'USD')
on conflict (code) do nothing;
