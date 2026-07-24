-- v0.2.1 Production Identity and Person Bootstrap
-- profiles = access identity · people = canonical human (CRM)
-- Never use profiles as the CRM record.

create extension if not exists "pgcrypto";
create extension if not exists "citext";

-- ─── Canonical people ───────────────────────────────────────────────────────

create table if not exists people (
  id uuid primary key default gen_random_uuid(),
  display_name text not null,
  email_normalized citext,
  whatsapp_normalized text,
  primary_email citext,
  primary_whatsapp text,
  status text not null default 'active'
    check (status in ('active', 'merged', 'archived')),
  merged_into_id uuid references people(id) on delete set null,
  first_source text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- One active person per normalized email / WhatsApp (nulls allowed)
create unique index if not exists people_email_normalized_uidx
  on people (email_normalized)
  where email_normalized is not null and status = 'active';

create unique index if not exists people_whatsapp_normalized_uidx
  on people (whatsapp_normalized)
  where whatsapp_normalized is not null
    and whatsapp_normalized <> ''
    and status = 'active';

create index if not exists people_status_idx on people (status);

-- ─── Institutional relationships (views around one person) ──────────────────

create table if not exists person_relationships (
  id uuid primary key default gen_random_uuid(),
  person_id uuid not null references people(id) on delete cascade,
  relationship_slug text not null,
  status text not null default 'active'
    check (status in ('active', 'ended', 'pending')),
  started_at timestamptz not null default now(),
  ended_at timestamptz,
  source text,
  meta jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create unique index if not exists person_relationships_active_uidx
  on person_relationships (person_id, relationship_slug)
  where status = 'active';

create index if not exists person_relationships_person_idx
  on person_relationships (person_id);

-- ─── Profile ↔ person (access identity → human) ─────────────────────────────

alter table profiles
  add column if not exists person_id uuid references people(id) on delete set null;

create index if not exists profiles_person_id_idx on profiles (person_id);

-- ─── Link public submissions to people ──────────────────────────────────────

alter table gathering_interest
  add column if not exists person_id uuid references people(id) on delete set null;

create index if not exists gathering_interest_person_id_idx
  on gathering_interest (person_id);

alter table retreat_applications
  add column if not exists person_id uuid references people(id) on delete set null;

create index if not exists retreat_applications_person_id_idx
  on retreat_applications (person_id);

-- event_participation.person_id already exists (text/uuid); enforce FK when possible
do $$ begin
  alter table event_participation
    alter column person_id type uuid using nullif(person_id::text, '')::uuid;
exception when others then null;
end $$;

do $$ begin
  alter table event_participation
    add constraint event_participation_person_id_fkey
    foreign key (person_id) references people(id) on delete set null;
exception when duplicate_object then null;
when others then null;
end $$;

-- ─── Append-only migration / link audit ─────────────────────────────────────

create table if not exists person_migration_audit (
  id uuid primary key default gen_random_uuid(),
  action text not null,
  person_id uuid references people(id) on delete set null,
  object_type text,
  object_id text,
  match_method text,
  meta jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists person_migration_audit_person_idx
  on person_migration_audit (person_id);

create index if not exists person_migration_audit_created_idx
  on person_migration_audit (created_at desc);

-- No update/delete for non-service paths (RLS below). Append-only by convention.

-- ─── Backfill people from gathering_interest ────────────────────────────────

insert into people (display_name, email_normalized, whatsapp_normalized, primary_email, primary_whatsapp, first_source)
select distinct on (lower(trim(gi.email)))
  coalesce(nullif(trim(gi.full_name), ''), split_part(gi.email::text, '@', 1)),
  lower(trim(gi.email::text)),
  nullif(regexp_replace(coalesce(gi.whatsapp, ''), '[^0-9+]', '', 'g'), ''),
  lower(trim(gi.email::text)),
  nullif(trim(coalesce(gi.whatsapp, '')), ''),
  'gathering_interest'
from gathering_interest gi
where gi.email is not null
  and not exists (
    select 1 from people p
    where p.email_normalized = lower(trim(gi.email::text))
      and p.status = 'active'
  )
order by lower(trim(gi.email)), gi.created_at asc;

update gathering_interest gi
set person_id = p.id
from people p
where gi.person_id is null
  and p.email_normalized = lower(trim(gi.email::text))
  and p.status = 'active';

insert into person_migration_audit (action, person_id, object_type, object_id, match_method, meta)
select
  'backfill_interest',
  gi.person_id,
  'gathering_interest',
  gi.id::text,
  'email',
  jsonb_build_object('event_id', gi.event_id)
from gathering_interest gi
where gi.person_id is not null
  and not exists (
    select 1 from person_migration_audit a
    where a.object_type = 'gathering_interest'
      and a.object_id = gi.id::text
      and a.action = 'backfill_interest'
  );

-- ─── Backfill people from retreat_applications ──────────────────────────────

insert into people (display_name, email_normalized, whatsapp_normalized, primary_email, primary_whatsapp, first_source)
select distinct on (ra.email_normalized)
  coalesce(nullif(trim(ra.full_name), ''), split_part(ra.email_normalized::text, '@', 1)),
  lower(trim(ra.email_normalized::text)),
  nullif(trim(ra.phone_e164), ''),
  lower(trim(ra.email_normalized::text)),
  nullif(trim(ra.phone_e164), ''),
  'retreat_application'
from retreat_applications ra
where ra.email_normalized is not null
  and not exists (
    select 1 from people p
    where p.email_normalized = lower(trim(ra.email_normalized::text))
      and p.status = 'active'
  )
order by ra.email_normalized, ra.created_at asc;

update retreat_applications ra
set person_id = p.id
from people p
where ra.person_id is null
  and p.email_normalized = lower(trim(ra.email_normalized::text))
  and p.status = 'active';

insert into person_migration_audit (action, person_id, object_type, object_id, match_method, meta)
select
  'backfill_application',
  ra.person_id,
  'retreat_application',
  ra.id::text,
  'email',
  jsonb_build_object('application_code', ra.application_code)
from retreat_applications ra
where ra.person_id is not null
  and not exists (
    select 1 from person_migration_audit a
    where a.object_type = 'retreat_application'
      and a.object_id = ra.id::text
      and a.action = 'backfill_application'
  );

-- ─── People for existing profiles (access → human) ──────────────────────────

insert into people (display_name, email_normalized, primary_email, first_source)
select
  coalesce(nullif(trim(pr.full_name), ''), split_part(pr.email::text, '@', 1)),
  lower(trim(pr.email::text)),
  lower(trim(pr.email::text)),
  'profile'
from profiles pr
where pr.person_id is null
  and not exists (
    select 1 from people p
    where p.email_normalized = lower(trim(pr.email::text))
      and p.status = 'active'
  );

update profiles pr
set person_id = p.id
from people p
where pr.person_id is null
  and p.email_normalized = lower(trim(pr.email::text))
  and p.status = 'active';

insert into person_migration_audit (action, person_id, object_type, object_id, match_method, meta)
select
  'profile_linked',
  pr.person_id,
  'profile',
  pr.id::text,
  'email',
  jsonb_build_object('email', pr.email::text)
from profiles pr
where pr.person_id is not null
  and not exists (
    select 1 from person_migration_audit a
    where a.object_type = 'profile'
      and a.object_id = pr.id::text
      and a.action = 'profile_linked'
  );

-- Seed relationship from profile.relationship_slug when present
insert into person_relationships (person_id, relationship_slug, source, source)
select pr.person_id, pr.relationship_slug, 'active', 'profile'
from profiles pr
where pr.person_id is not null
  and pr.relationship_slug is not null
  and pr.relationship_slug <> ''
  and not exists (
    select 1 from person_relationships r
    where r.person_id = pr.person_id
      and r.relationship_slug = pr.relationship_slug
      and r.status = 'active'
  );

-- ─── RLS ────────────────────────────────────────────────────────────────────

alter table people enable row level security;
alter table person_relationships enable row level security;
alter table person_migration_audit enable row level security;

-- Helpers: staff with CMS access via profiles
create or replace function public.is_active_staff()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from profiles p
    where p.auth_user_id = auth.uid()
      and p.status = 'active'
      and (
        p.is_super_admin = true
        or exists (
          select 1
          from user_roles ur
          join roles r on r.id = ur.role_id
          where ur.profile_id = p.id
            and r.cms_access = true
        )
      )
  );
$$;

-- People: staff read; no public read; writes via service role
drop policy if exists people_staff_select on people;
create policy people_staff_select
  on people for select to authenticated
  using (public.is_active_staff());

drop policy if exists person_relationships_staff_select on person_relationships;
create policy person_relationships_staff_select
  on person_relationships for select to authenticated
  using (public.is_active_staff());

drop policy if exists person_migration_audit_staff_select on person_migration_audit;
create policy person_migration_audit_staff_select
  on person_migration_audit for select to authenticated
  using (public.is_active_staff());

-- Authenticated user may read own linked person (portal)
drop policy if exists people_self_select on people;
create policy people_self_select
  on people for select to authenticated
  using (
    exists (
      select 1 from profiles p
      where p.auth_user_id = auth.uid()
        and p.person_id = people.id
        and p.status = 'active'
    )
  );

-- No insert/update/delete policies for authenticated — service role only for writes.
-- Audit table: staff read-only; service role inserts.

comment on table people is 'Canonical human record (CRM). profiles is access identity only.';
comment on table person_migration_audit is 'Append-only identity link and migration audit.';
comment on column profiles.person_id is 'Link to people — profile is not the CRM record.';
