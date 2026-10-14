-- ============================================================
-- UP SMK Taruna Bhakti — Supabase Schema (Postgres)
-- Single-database multi-tenant via jurusan_id + metadata JSONB
-- Jalankan di Supabase SQL Editor, urut: schema.sql -> rls.sql -> seed.sql
-- ============================================================

-- Extensions
create extension if not exists "uuid-ossp";
create extension if not exists "pgcrypto";

-- ---------- JURUSAN ----------
create table if not exists public.jurusan (
  id uuid primary key default uuid_generate_v4(),
  kode text not null unique check (kode in ('DKV','TKJ','RPL','BC','ANIMASI','TE')),
  nama text not null,
  deskripsi text not null default '',
  aktif boolean not null default true,
  created_at timestamptz not null default now()
);

-- ---------- USERS (profil, 1:1 dengan auth.users) ----------
create table if not exists public.users (
  id uuid primary key references auth.users(id) on delete cascade,
  name text not null,
  email text not null unique,
  role text not null default 'klien'
    check (role in ('super_admin','admin_jurusan','siswa','klien')),
  jurusan_id uuid references public.jurusan(id) on delete set null,
  created_at timestamptz not null default now()
);
create index if not exists idx_users_role on public.users(role);
create index if not exists idx_users_jurusan on public.users(jurusan_id);

-- ---------- KATALOG ----------
create table if not exists public.products_services (
  id uuid primary key default uuid_generate_v4(),
  jurusan_id uuid not null references public.jurusan(id) on delete cascade,
  nama text not null,
  tipe text not null default 'service' check (tipe in ('product','service')),
  harga numeric(14,2) not null default 0 check (harga >= 0),
  satuan text not null default 'paket',
  deskripsi text not null default '',
  -- Parameter spesifik/jurusan: durasi sewa BC, spek PCB TE, dsb.
  metadata jsonb not null default '{}'::jsonb,
  aktif boolean not null default true,
  created_at timestamptz not null default now()
);
create index if not exists idx_catalog_jurusan on public.products_services(jurusan_id);
create index if not exists idx_catalog_aktif on public.products_services(aktif);
create index if not exists idx_catalog_metadata on public.products_services using gin (metadata);

-- ---------- EQUIPMENT (khusus BC + pinjam alat, reusable TE/TKJ) ----------
create table if not exists public.equipment (
  id uuid primary key default uuid_generate_v4(),
  jurusan_id uuid not null references public.jurusan(id) on delete cascade,
  nama text not null,
  stok_total int not null default 1 check (stok_total >= 0),
  stok_tersedia int not null default 1 check (stok_tersedia >= 0),
  harga_sewa_per_hari numeric(14,2) not null default 0,
  metadata jsonb not null default '{}'::jsonb,
  aktif boolean not null default true,
  created_at timestamptz not null default now()
);
create index if not exists idx_equipment_jurusan on public.equipment(jurusan_id);

-- ---------- ORDERS ----------
create table if not exists public.orders (
  id uuid primary key default uuid_generate_v4(),
  invoice_no text not null unique,
  client_id uuid not null references public.users(id) on delete restrict,
  jurusan_id uuid not null references public.jurusan(id) on delete restrict,
  layanan_id uuid references public.products_services(id) on delete set null,
  total numeric(14,2) not null check (total >= 0),
  snap_token text,
  snap_redirect_url text,
  payment_status text not null default 'pending_payment'
    check (payment_status in ('pending_payment','settlement','expire','cancel','deny')),
  project_status text not null default 'brief'
    check (project_status in ('brief','in_progress','review','revision','completed')),
  -- Isi form dinamis/jurusan (brief DKV, jadwal TKJ, requirement RPL, durasi BC, dst.)
  brief jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists idx_orders_client on public.orders(client_id);
create index if not exists idx_orders_jurusan on public.orders(jurusan_id);
create index if not exists idx_orders_payment on public.orders(payment_status);
create index if not exists idx_orders_project on public.orders(project_status);
create index if not exists idx_orders_brief on public.orders using gin (brief);

-- ---------- PROJECT TRACKING ----------
create table if not exists public.project_tracking (
  id uuid primary key default uuid_generate_v4(),
  order_id uuid not null references public.orders(id) on delete cascade,
  assigned_student uuid references public.users(id) on delete set null,
  tahapan text not null default 'brief'
    check (tahapan in ('brief','in_progress','review','revision','completed')),
  -- Label pipeline khusus (mis. Animasi: concept/sketch/color/render/postpro)
  pipeline_label text,
  notes text not null default '',
  file_url text,
  created_by uuid references public.users(id) on delete set null,
  created_at timestamptz not null default now()
);
create index if not exists idx_tracking_order on public.project_tracking(order_id);
create index if not exists idx_tracking_student on public.project_tracking(assigned_student);

-- ---------- REVENUE SPLITS (bagi hasil per order, 1:1) ----------
create table if not exists public.revenue_splits (
  id uuid primary key default uuid_generate_v4(),
  order_id uuid not null unique references public.orders(id) on delete cascade,
  pct_up numeric(5,2) not null default 30.00,
  pct_jurusan numeric(5,2) not null default 30.00,
  pct_siswa numeric(5,2) not null default 40.00,
  amount_up numeric(14,2) not null default 0,
  amount_jurusan numeric(14,2) not null default 0,
  amount_siswa numeric(14,2) not null default 0,
  created_at timestamptz not null default now()
);
create index if not exists idx_splits_order on public.revenue_splits(order_id);

-- ---------- UPDATED_AT TRIGGER ----------
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end $$;

drop trigger if exists trg_orders_updated on public.orders;
create trigger trg_orders_updated
  before update on public.orders
  for each row execute function public.set_updated_at();
