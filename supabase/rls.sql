-- ============================================================
-- UP SMK Taruna Bhakti — Row Level Security (RLS)
-- Jalankan SETELAH schema.sql
-- Prinsip: klien hanya miliknya, siswa hanya task assigned,
-- admin jurusan hanya jurusannya, super_admin bypass via helper.
-- ============================================================

alter table public.jurusan enable row level security;
alter table public.users enable row level security;
alter table public.products_services enable row level security;
alter table public.equipment enable row level security;
alter table public.orders enable row level security;
alter table public.project_tracking enable row level security;
alter table public.revenue_splits enable row level security;

-- ---------- HELPER (SECURITY DEFINER, anti-rekursi) ----------
create or replace function public.my_role()
returns text language sql security definer set search_path = public as $$
  select role from public.users where id = auth.uid();
$$;

create or replace function public.my_jurusan()
returns uuid language sql security definer set search_path = public as $$
  select jurusan_id from public.users where id = auth.uid();
$$;

create or replace function public.is_super_admin()
returns boolean language sql security definer set search_path = public as $$
  select exists (select 1 from public.users where id = auth.uid() and role = 'super_admin');
$$;

-- ---------- JURUSAN: publik bisa baca yang aktif ----------
drop policy if exists jurusan_read on public.jurusan;
create policy jurusan_read on public.jurusan
  for select using (aktif = true or public.is_super_admin());

drop policy if exists jurusan_write on public.jurusan;
create policy jurusan_write on public.jurusan
  for all using (public.is_super_admin()) with check (public.is_super_admin());

-- ---------- USERS ----------
drop policy if exists users_self_read on public.users;
create policy users_self_read on public.users
  for select using (id = auth.uid() or public.is_super_admin());

-- Admin jurusan boleh lihat user di jurusannya (untuk assign siswa)
drop policy if exists users_jurusan_read on public.users;
create policy users_jurusan_read on public.users
  for select using (
    public.my_role() = 'admin_jurusan'
    and jurusan_id is not distinct from public.my_jurusan()
  );

drop policy if exists users_self_update on public.users;
create policy users_self_update on public.users
  for update using (id = auth.uid() or public.is_super_admin())
  with check (id = auth.uid() or public.is_super_admin());

-- Insert profil saat registrasi: user boleh insert dirinya sendiri
drop policy if exists users_self_insert on public.users;
create policy users_self_insert on public.users
  for insert with check (id = auth.uid());

-- ---------- KATALOG: publik baca yang aktif, tulis hanya admin jurusan pemilik + super ----------
drop policy if exists catalog_read on public.products_services;
create policy catalog_read on public.products_services
  for select using (aktif = true or public.is_super_admin() or (
    public.my_role() = 'admin_jurusan' and jurusan_id = public.my_jurusan()
  ));

drop policy if exists catalog_write on public.products_services;
create policy catalog_write on public.products_services
  for all using (
    public.is_super_admin() or (
      public.my_role() = 'admin_jurusan' and jurusan_id = public.my_jurusan()
    )
  ) with check (
    public.is_super_admin() or (
      public.my_role() = 'admin_jurusan' and jurusan_id = public.my_jurusan()
    )
  );

-- ---------- EQUIPMENT: sama seperti katalog ----------
drop policy if exists equipment_read on public.equipment;
create policy equipment_read on public.equipment
  for select using (aktif = true or public.is_super_admin() or (
    public.my_role() = 'admin_jurusan' and jurusan_id = public.my_jurusan()
  ));

drop policy if exists equipment_write on public.equipment;
create policy equipment_write on public.equipment
  for all using (
    public.is_super_admin() or (
      public.my_role() = 'admin_jurusan' and jurusan_id = public.my_jurusan()
    )
  ) with check (
    public.is_super_admin() or (
      public.my_role() = 'admin_jurusan' and jurusan_id = public.my_jurusan()
    )
  );

-- ---------- ORDERS ----------
drop policy if exists orders_client on public.orders;
create policy orders_client on public.orders
  for select using (
    client_id = auth.uid() or public.is_super_admin() or (
      public.my_role() = 'admin_jurusan' and jurusan_id = public.my_jurusan()
    ) or exists (
      select 1 from public.project_tracking t
      where t.order_id = orders.id and t.assigned_student = auth.uid()
    )
  );

drop policy if exists orders_insert on public.orders;
create policy orders_insert on public.orders
  for insert with check (client_id = auth.uid());

-- Update status proyek oleh admin/super; klien boleh update konfirmasi selesai miliknya
drop policy if exists orders_update on public.orders;
create policy orders_update on public.orders
  for update using (
    public.is_super_admin() or (
      public.my_role() = 'admin_jurusan' and jurusan_id = public.my_jurusan()
    ) or client_id = auth.uid()
  ) with check (
    public.is_super_admin() or (
      public.my_role() = 'admin_jurusan' and jurusan_id = public.my_jurusan()
    ) or client_id = auth.uid()
  );

-- ---------- TRACKING ----------
drop policy if exists tracking_read on public.project_tracking;
create policy tracking_read on public.project_tracking
  for select using (
    assigned_student = auth.uid() or public.is_super_admin() or exists (
      select 1 from public.orders o
      where o.id = project_tracking.order_id
        and (o.client_id = auth.uid()
          or (public.my_role() = 'admin_jurusan' and o.jurusan_id = public.my_jurusan()))
    )
  );

drop policy if exists tracking_write on public.project_tracking;
create policy tracking_write on public.project_tracking
  for all using (
    public.is_super_admin() or assigned_student = auth.uid() or (
      public.my_role() = 'admin_jurusan' and exists (
        select 1 from public.orders o
        where o.id = project_tracking.order_id and o.jurusan_id = public.my_jurusan()
      )
    )
  ) with check (
    public.is_super_admin() or assigned_student = auth.uid() or (
      public.my_role() = 'admin_jurusan' and exists (
        select 1 from public.orders o
        where o.id = project_tracking.order_id and o.jurusan_id = public.my_jurusan()
      )
    )
  );

-- ---------- REVENUE SPLITS ----------
drop policy if exists splits_read on public.revenue_splits;
create policy splits_read on public.revenue_splits
  for select using (
    public.is_super_admin() or exists (
      select 1 from public.orders o
      where o.id = revenue_splits.order_id
        and (public.my_role() = 'admin_jurusan' and o.jurusan_id = public.my_jurusan())
    )
  );

drop policy if exists splits_write on public.revenue_splits;
create policy splits_write on public.revenue_splits
  for all using (public.is_super_admin()) with check (public.is_super_admin());
