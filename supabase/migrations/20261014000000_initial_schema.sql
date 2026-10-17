create extension if not exists pgcrypto;

create type public.application_status as enum (
  'pendiente',
  'en_revision',
  'aprobada',
  'rechazada'
);

create table public.user_roles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  role text not null check (role in ('admin', 'editor')),
  created_at timestamptz not null default now()
);

create table public.applications (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  church text not null,
  denomination text not null,
  theological_education text not null,
  institution_studied text not null,
  phone text not null,
  email text not null,
  ministry_institution text not null,
  confession text not null,
  city text not null,
  province text not null,
  doctrine jsonb not null,
  privacy_consent boolean not null default false,
  status public.application_status not null default 'pendiente',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.events (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text not null default '',
  location text not null default '',
  starts_at timestamptz not null,
  registration_url text,
  is_published boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.pastors (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  institution text not null,
  city text not null,
  province text not null,
  is_published boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create or replace function public.has_prea_role()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1 from public.user_roles
    where user_id = (select auth.uid())
  );
$$;

create or replace function public.is_prea_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1 from public.user_roles
    where user_id = (select auth.uid()) and role = 'admin'
  );
$$;

alter table public.user_roles enable row level security;
alter table public.applications enable row level security;
alter table public.events enable row level security;
alter table public.pastors enable row level security;

create policy "PREA users can read their own role"
on public.user_roles for select to authenticated
using (user_id = (select auth.uid()));

create policy "Admins manage roles"
on public.user_roles for all to authenticated
using (public.is_prea_admin())
with check (public.is_prea_admin());

create policy "PREA users manage applications"
on public.applications for all to authenticated
using (public.has_prea_role())
with check (public.has_prea_role());

create policy "Anyone can read published events"
on public.events for select to anon, authenticated
using (is_published);

create policy "PREA users manage events"
on public.events for all to authenticated
using (public.has_prea_role())
with check (public.has_prea_role());

create policy "Anyone can read published pastors"
on public.pastors for select to anon, authenticated
using (is_published);

create policy "PREA users manage pastor directory"
on public.pastors for all to authenticated
using (public.has_prea_role())
with check (public.has_prea_role());

grant usage on schema public to anon, authenticated;
grant select on public.events, public.pastors to anon, authenticated;
grant select on public.user_roles to authenticated;
grant select, insert, update, delete on public.applications, public.events, public.pastors to authenticated;
grant insert, update, delete on public.user_roles to authenticated;

create index applications_status_created_at_idx on public.applications (status, created_at desc);
create index events_published_starts_at_idx on public.events (is_published, starts_at);
create index pastors_published_name_idx on public.pastors (is_published, full_name);
