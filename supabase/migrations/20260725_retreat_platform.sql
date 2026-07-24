-- Founder-Being Retreat Platform (MVP)
-- Kodaikanal Full Moon Retreat + multi-retreat ready schema
-- Enable RLS on all tables. Public inserts only via service role (server).

create extension if not exists "pgcrypto";
create extension if not exists "citext";

-- Enums
do $$ begin
  create type retreat_status as enum (
    'draft', 'open', 'closed', 'confirmed', 'postponed', 'cancelled', 'completed'
  );
exception when duplicate_object then null; end $$;

do $$ begin
  create type application_status as enum (
    'submitted', 'under_review', 'shortlisted', 'selected', 'contacted',
    'payment_pending', 'deposit_paid', 'paid', 'waitlisted', 'rejected',
    'withdrawn', 'refunded', 'cancelled'
  );
exception when duplicate_object then null; end $$;

do $$ begin
  create type kochi_transport as enum ('yes', 'no', 'unsure');
exception when duplicate_object then null; end $$;

do $$ begin
  create type pricing_tier as enum ('early_bird', 'standard', 'manual_override');
exception when duplicate_object then null; end $$;

do $$ begin
  create type payment_type as enum ('deposit', 'balance', 'full', 'refund');
exception when duplicate_object then null; end $$;

do $$ begin
  create type payment_method as enum ('bank_transfer', 'upi', 'cash', 'other');
exception when duplicate_object then null; end $$;

do $$ begin
  create type admin_role as enum ('owner', 'reviewer', 'finance');
exception when duplicate_object then null; end $$;

-- Admin profiles (maps Supabase auth.users)
create table if not exists admin_profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  full_name text,
  role admin_role not null default 'reviewer',
  created_at timestamptz not null default now()
);

create table if not exists retreats (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  location_public text not null,
  venue_private text,
  starts_at timestamptz not null,
  ends_at timestamptz not null,
  capacity integer not null default 15,
  minimum_paid integer not null default 12,
  early_bird_capacity integer not null default 5,
  early_bird_price numeric(10,2) not null default 54500,
  standard_price numeric(10,2) not null default 57500,
  deposit_amount numeric(10,2) not null default 15000,
  application_deadline timestamptz,
  contact_deadline timestamptz,
  go_no_go_date date,
  status retreat_status not null default 'draft',
  facilitator_public boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists retreat_applications (
  id uuid primary key default gen_random_uuid(),
  retreat_id uuid not null references retreats(id) on delete cascade,
  application_code text not null unique,
  full_name text not null check (char_length(full_name) between 2 and 100),
  email_normalized citext not null,
  phone_e164 text not null,
  city_country text not null,
  company_name text not null,
  current_role text not null,
  linkedin_url text,
  company_url text,
  startup_stage text not null,
  motivation text not null check (char_length(motivation) between 150 and 1500),
  desired_outcome text not null check (char_length(desired_outcome) between 100 and 1000),
  founder_context text,
  attended_before boolean not null default false,
  referral_source text,
  kochi_transport kochi_transport not null,
  twin_sharing boolean not null,
  dietary_basic text,
  accessibility_basic text,
  privacy_consent_at timestamptz not null,
  terms_consent_at timestamptz not null,
  marketing_consent_at timestamptz,
  status application_status not null default 'submitted',
  assigned_reviewer uuid references admin_profiles(id),
  internal_rating smallint check (internal_rating between 1 and 5),
  utm_source text,
  utm_medium text,
  utm_campaign text,
  referrer text,
  ip_hash text,
  idempotency_key text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (retreat_id, email_normalized),
  unique (retreat_id, phone_e164),
  check (linkedin_url is not null or company_url is not null)
);

create table if not exists application_status_history (
  id uuid primary key default gen_random_uuid(),
  application_id uuid not null references retreat_applications(id) on delete cascade,
  from_status text,
  to_status text not null,
  reason text,
  changed_by uuid references admin_profiles(id),
  created_at timestamptz not null default now()
);

create table if not exists application_notes (
  id uuid primary key default gen_random_uuid(),
  application_id uuid not null references retreat_applications(id) on delete cascade,
  note text not null,
  created_by uuid references admin_profiles(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists payment_records (
  id uuid primary key default gen_random_uuid(),
  application_id uuid not null references retreat_applications(id) on delete restrict,
  pricing_tier pricing_tier not null default 'standard',
  amount_due numeric(10,2) not null,
  amount_received numeric(10,2) not null,
  payment_type payment_type not null,
  method payment_method not null default 'upi',
  reference_masked text,
  proof_path text,
  received_at timestamptz,
  recorded_by uuid references admin_profiles(id),
  created_at timestamptz not null default now()
);

create table if not exists post_selection_details (
  application_id uuid primary key references retreat_applications(id) on delete cascade,
  emergency_contact text,
  government_id_ref text,
  allergies_dietary text,
  health_accessibility_notes text,
  roommate_preference text,
  travel_arrival_details text,
  updated_at timestamptz not null default now()
);

-- Seed Kodaikanal retreat
insert into retreats (
  slug, title, location_public, starts_at, ends_at,
  capacity, minimum_paid, early_bird_capacity,
  early_bird_price, standard_price, deposit_amount,
  contact_deadline, go_no_go_date, status, facilitator_public
) values (
  'kodaikanal-full-moon-2026',
  'Kodaikanal Full Moon Retreat',
  'Kodaikanal, Tamil Nadu',
  '2026-08-26T00:00:00+05:30',
  '2026-08-31T23:59:59+05:30',
  15, 12, 5,
  54500, 57500, 15000,
  '2026-08-03T23:59:59+05:30',
  '2026-08-10',
  'open',
  false
) on conflict (slug) do nothing;

-- RLS
alter table admin_profiles enable row level security;
alter table retreats enable row level security;
alter table retreat_applications enable row level security;
alter table application_status_history enable row level security;
alter table application_notes enable row level security;
alter table payment_records enable row level security;
alter table post_selection_details enable row level security;

-- No public policies: anon cannot SELECT/INSERT/UPDATE/DELETE.
-- Server uses service role for inserts. Authenticated admins use policies below.

create or replace function is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from admin_profiles p where p.id = auth.uid()
  );
$$;

create policy "admins read retreats"
  on retreats for select to authenticated
  using (is_admin());

create policy "admins read applications"
  on retreat_applications for select to authenticated
  using (is_admin());

create policy "admins update applications"
  on retreat_applications for update to authenticated
  using (is_admin());

create policy "admins read history"
  on application_status_history for select to authenticated
  using (is_admin());

create policy "admins insert history"
  on application_status_history for insert to authenticated
  with check (is_admin());

create policy "admins notes"
  on application_notes for all to authenticated
  using (is_admin())
  with check (is_admin());

create policy "admins payments read"
  on payment_records for select to authenticated
  using (is_admin());

create policy "admins payments insert"
  on payment_records for insert to authenticated
  with check (is_admin());

create policy "admins post selection"
  on post_selection_details for all to authenticated
  using (is_admin())
  with check (is_admin());

create policy "admins profiles self"
  on admin_profiles for select to authenticated
  using (id = auth.uid() or is_admin());
