-- Founder-Being IAM — Team & Access
-- RBAC: roles → permissions → user_roles; Super Admin protected.

create extension if not exists "pgcrypto";
create extension if not exists "citext";

do $$ begin
  create type iam_user_status as enum (
    'active', 'invited', 'pending', 'deactivated', 'suspended'
  );
exception when duplicate_object then null; end $$;

do $$ begin
  create type invitation_status as enum (
    'pending', 'accepted', 'expired', 'revoked', 'cancelled'
  );
exception when duplicate_object then null; end $$;

do $$ begin
  create type access_request_status as enum (
    'pending', 'approved', 'rejected', 'cancelled'
  );
exception when duplicate_object then null; end $$;

-- Canonical app profiles (link to auth.users when present)
create table if not exists profiles (
  id uuid primary key default gen_random_uuid(),
  auth_user_id uuid unique references auth.users(id) on delete set null,
  email citext not null unique,
  full_name text not null,
  avatar_url text,
  status iam_user_status not null default 'pending',
  mfa_enabled boolean not null default false,
  last_login_at timestamptz,
  is_super_admin boolean not null default false,
  protected boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists roles (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  description text,
  rank integer not null default 100,
  mfa_required boolean not null default false,
  cms_access boolean not null default false,
  portal_only boolean not null default false,
  requestable boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists permissions (
  id uuid primary key default gen_random_uuid(),
  key text not null unique,
  category text not null,
  action text not null,
  description text
);

create table if not exists role_permissions (
  role_id uuid not null references roles(id) on delete cascade,
  permission_id uuid not null references permissions(id) on delete cascade,
  primary key (role_id, permission_id)
);

create table if not exists user_roles (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references profiles(id) on delete cascade,
  role_id uuid not null references roles(id) on delete restrict,
  assigned_by uuid references profiles(id),
  assigned_at timestamptz not null default now(),
  unique (profile_id, role_id)
);

create table if not exists departments (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  created_at timestamptz not null default now()
);

create table if not exists department_members (
  department_id uuid not null references departments(id) on delete cascade,
  profile_id uuid not null references profiles(id) on delete cascade,
  primary key (department_id, profile_id)
);

create table if not exists invitations (
  id uuid primary key default gen_random_uuid(),
  email citext not null,
  full_name text not null,
  role_id uuid not null references roles(id),
  department_id uuid references departments(id),
  note text,
  token text not null unique,
  status invitation_status not null default 'pending',
  invited_by uuid references profiles(id),
  expires_at timestamptz not null,
  accepted_at timestamptz,
  created_at timestamptz not null default now()
);

create table if not exists access_requests (
  id uuid primary key default gen_random_uuid(),
  email citext not null,
  full_name text not null,
  preferred_role_slugs text[] not null default '{}',
  note text,
  status access_request_status not null default 'pending',
  assigned_role_id uuid references roles(id),
  reviewed_by uuid references profiles(id),
  reviewed_at timestamptz,
  created_at timestamptz not null default now()
);

create table if not exists user_sessions (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references profiles(id) on delete cascade,
  device_label text,
  browser text,
  ip_hash text,
  location_label text,
  last_seen_at timestamptz not null default now(),
  revoked_at timestamptz,
  created_at timestamptz not null default now()
);

create table if not exists audit_logs (
  id uuid primary key default gen_random_uuid(),
  actor_profile_id uuid references profiles(id),
  action text not null,
  object_type text,
  object_id text,
  meta jsonb not null default '{}',
  ip_hash text,
  user_agent text,
  created_at timestamptz not null default now()
);

-- Seed roles
insert into roles (slug, name, description, rank, mfa_required, cms_access, portal_only, requestable) values
  ('super_administrator', 'Super Administrator', 'Full system access. Protected ownership.', 0, true, true, false, false),
  ('co_founder', 'Co-Founder', 'Operational leadership.', 1, true, true, false, true),
  ('founding_team', 'Founding Team', 'Leadership team.', 2, true, true, false, true),
  ('patron', 'Patron', 'Patron portal — read-only.', 3, false, false, true, true),
  ('programme_lead', 'Programme Lead', 'Retreats and gatherings.', 4, true, true, false, true),
  ('finance', 'Finance', 'Payments and reports only.', 5, true, true, false, true),
  ('reviewer', 'Reviewer', 'Application review only.', 6, false, true, false, true),
  ('operations', 'Operations', 'Logistics and participants.', 7, false, true, false, true),
  ('volunteer', 'Volunteer', 'Limited, often retreat-scoped.', 8, false, true, false, true),
  ('member', 'Member', 'Portal only — no CMS.', 9, false, false, true, true),
  ('guest', 'Guest', 'Invitation-only read access.', 10, false, false, true, false)
on conflict (slug) do nothing;

-- Seed departments
insert into departments (slug, name) values
  ('executive_office', 'Executive Office'),
  ('founding_team', 'Founding Team'),
  ('retreat_operations', 'Retreat Operations'),
  ('finance', 'Finance'),
  ('community', 'Community'),
  ('marketing', 'Marketing'),
  ('advisory_council', 'Advisory Council'),
  ('patron_circle', 'Patron Circle'),
  ('volunteers', 'Volunteers')
on conflict (slug) do nothing;

-- Seed Super Administrator profile (auth_user_id linked on first login)
insert into profiles (email, full_name, status, is_super_admin, protected)
values ('jimmymanalel@gmail.com', 'Jimmy James', 'active', true, true)
on conflict (email) do update set
  full_name = excluded.full_name,
  is_super_admin = true,
  protected = true,
  status = 'active';

insert into user_roles (profile_id, role_id)
select p.id, r.id
from profiles p
cross join roles r
where p.email = 'jimmymanalel@gmail.com'
  and r.slug = 'super_administrator'
on conflict (profile_id, role_id) do nothing;

-- Wildcard permission for super admin role
insert into permissions (key, category, action, description)
values ('*', '*', '*', 'All permissions')
on conflict (key) do nothing;

insert into role_permissions (role_id, permission_id)
select r.id, p.id
from roles r
cross join permissions p
where r.slug = 'super_administrator' and p.key = '*'
on conflict do nothing;

-- RLS
alter table profiles enable row level security;
alter table roles enable row level security;
alter table permissions enable row level security;
alter table role_permissions enable row level security;
alter table user_roles enable row level security;
alter table departments enable row level security;
alter table department_members enable row level security;
alter table invitations enable row level security;
alter table access_requests enable row level security;
alter table user_sessions enable row level security;
alter table audit_logs enable row level security;

-- Service role bypasses RLS; authenticated policies added when app auth is wired.
create or replace function is_super_admin_user()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from profiles p
    where p.auth_user_id = auth.uid()
      and p.is_super_admin = true
      and p.status = 'active'
  );
$$;
