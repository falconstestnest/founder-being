-- Gathering interest / invitation requests (CMS-tagged submissions)

create table if not exists gathering_interest (
  id uuid primary key default gen_random_uuid(),
  event_id text not null,
  event_name text not null,
  event_type text not null,
  city text not null,
  registration_workflow text not null,
  event_slug text,
  full_name text not null,
  email citext not null,
  whatsapp text,
  location text,
  company text,
  is_founder text,
  note text,
  marketing_consent boolean not null default false,
  status text not null default 'new',
  created_at timestamptz not null default now()
);

create index if not exists gathering_interest_event_id_idx
  on gathering_interest (event_id);

create index if not exists gathering_interest_created_at_idx
  on gathering_interest (created_at desc);

alter table gathering_interest enable row level security;
-- No public policies: inserts via service role only.
