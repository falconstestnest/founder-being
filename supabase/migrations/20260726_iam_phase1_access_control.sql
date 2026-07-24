-- Phase 1 production access control refinements
-- Run after 20260726_iam_team_access.sql (or merge in fresh environments)

-- Institutional relationship (not a CMS role)
alter table profiles
  add column if not exists relationship_slug text;

-- Invitation token stored hashed only
alter table invitations
  add column if not exists token_hash text;

-- Prefer token_hash; keep token nullable for migration
alter table invitations
  alter column token drop not null;

-- Access request lifecycle + approval note
alter table access_requests
  add column if not exists approval_note text;

-- Expand status check via text (enum may already exist — store as text if needed)
-- Preferred statuses: submitted, under_review, approved, rejected, withdrawn, expired

-- Seed system roles (new model) without removing legacy slugs yet
insert into roles (slug, name, description, rank, mfa_required, cms_access, portal_only, requestable) values
  ('administrator', 'Administrator', 'Broad operational CMS access.', 1, true, true, false, true),
  ('programme_manager', 'Programme Manager', 'Retreats and gatherings.', 4, true, true, false, true),
  ('content_editor', 'Content Editor', 'Publish and edit public content.', 6, false, true, false, true),
  ('communications', 'Communications', 'Communications operations.', 7, false, true, false, true),
  ('read_only', 'Read Only', 'View without mutations.', 9, false, true, false, true),
  ('none', 'No CMS access', 'Relationship only.', 100, false, false, true, false)
on conflict (slug) do nothing;

-- Ensure Super Admin profile is protected and active (role only via user_roles / is_super_admin flag — never email login alone)
update profiles
set
  is_super_admin = true,
  protected = true,
  status = 'active',
  full_name = coalesce(nullif(full_name, ''), 'Jimmy James'),
  relationship_slug = coalesce(relationship_slug, 'co_founder')
where lower(email) = lower('jimmymanalel@gmail.com');

insert into profiles (email, full_name, status, is_super_admin, protected, relationship_slug)
values ('jimmymanalel@gmail.com', 'Jimmy James', 'active', true, true, 'co_founder')
on conflict (email) do nothing;

insert into user_roles (profile_id, role_id)
select p.id, r.id
from profiles p
cross join roles r
where lower(p.email) = lower('jimmymanalel@gmail.com')
  and r.slug = 'super_administrator'
on conflict (profile_id, role_id) do nothing;
