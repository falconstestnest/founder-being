-- Event lifecycle transition support (Events entity only — not Person graph)
-- Safe parallel write path alongside OS v0.2 Person bootstrap.

alter table event_lifecycle_audit
  add column if not exists reason text;

alter table event_lifecycle_audit
  add column if not exists meta jsonb not null default '{}'::jsonb;

-- Optional FK to access identity (profiles), not people
do $$ begin
  alter table event_lifecycle_audit
    add constraint event_lifecycle_audit_actor_profile_fkey
    foreign key (actor_profile_id) references profiles(id) on delete set null;
exception when duplicate_object then null;
when undefined_table then null;
end $$;

create index if not exists event_lifecycle_audit_event_created_idx
  on event_lifecycle_audit (event_id, created_at desc);

comment on table event_lifecycle_audit is
  'Append-only event lifecycle transitions. No updates/deletes via app policies.';

-- Staff may read audit; writes via service role only
drop policy if exists event_lifecycle_audit_staff_select on event_lifecycle_audit;
create policy event_lifecycle_audit_staff_select
  on event_lifecycle_audit for select to authenticated
  using (
    exists (
      select 1 from profiles p
      where p.auth_user_id = auth.uid()
        and p.status = 'active'
        and (
          p.is_super_admin = true
          or exists (
            select 1 from user_roles ur
            join roles r on r.id = ur.role_id
            where ur.profile_id = p.id and r.cms_access = true
          )
        )
    )
  );

drop policy if exists events_staff_select on events;
create policy events_staff_select
  on events for select to authenticated
  using (
    exists (
      select 1 from profiles p
      where p.auth_user_id = auth.uid()
        and p.status = 'active'
        and (
          p.is_super_admin = true
          or exists (
            select 1 from user_roles ur
            join roles r on r.id = ur.role_id
            where ur.profile_id = p.id and r.cms_access = true
          )
        )
    )
  );
