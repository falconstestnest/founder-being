-- Events Operations Foundation
-- Participation is source of truth; counts are derived.

create table if not exists events (
  id text primary key,
  slug text not null unique,
  title text not null,
  subtitle text,
  summary_line text,
  description text,
  event_type text not null,
  registration_workflow text not null,
  status_badge text not null default 'planning',
  lifecycle text not null default 'draft',
  themes text[] not null default '{}',
  country text not null,
  state text,
  city text not null,
  venue text,
  venue_public text,
  timezone text not null default 'Asia/Kolkata',
  starts_on date,
  ends_on date,
  capacity integer,
  cta text,
  public_path text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists event_participation (
  id uuid primary key default gen_random_uuid(),
  person_id uuid,
  event_id text not null references events(id) on delete cascade,
  source text,
  status text not null,
  workflow_stage text,
  invited_at timestamptz,
  confirmed_at timestamptz,
  paid_at timestamptz,
  attended_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists event_participation_event_id_idx
  on event_participation (event_id);

create index if not exists event_participation_status_idx
  on event_participation (event_id, status);

create table if not exists event_lifecycle_audit (
  id uuid primary key default gen_random_uuid(),
  event_id text not null references events(id) on delete cascade,
  from_stage text,
  to_stage text not null,
  actor_profile_id uuid,
  validation_ok boolean not null default true,
  errors text[],
  created_at timestamptz not null default now()
);

alter table events enable row level security;
alter table event_participation enable row level security;
alter table event_lifecycle_audit enable row level security;
-- Inserts/updates via service role; admin policies when auth profiles ready.
