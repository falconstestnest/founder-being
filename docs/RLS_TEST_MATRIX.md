# RLS Test Matrix — OS v0.2 / v0.2.1

**Status:** Spec for manual execution after migrations  
**Last verified:** 2026-07-25  

Do not mark production-secure until this matrix is run against the **production** Supabase project (or a staging clone with the same policies).

---

## Prerequisites

1. Migrations applied in order (see [SUPABASE_PRODUCTION_SETUP.md](./SUPABASE_PRODUCTION_SETUP.md)).  
2. Auth users for each role (or one staff user reassigned between tests).  
3. Service role used only from server / SQL editor — never in browser.  

---

## Actors

| Actor | How to authenticate |
| ----- | ------------------- |
| `anon` | No JWT |
| `authenticated_no_profile` | Auth user without `profiles` row |
| `portal_only` | Active profile, relationship only, no CMS role |
| `reviewer` | `reviewer` system role |
| `finance` | `finance` system role |
| `programme_manager` | `programme_manager` |
| `super_admin` | `is_super_admin` + protected profile |
| `service_role` | Service key (server) |

---

## Tables under test

| Table | Anon read | Staff read | Portal self | Client write |
| ----- | --------- | ---------- | ----------- | ------------ |
| `profiles` | deny | self / staff | self | deny (service) |
| `people` | deny | CMS staff | own via `profiles.person_id` | deny (service) |
| `person_relationships` | deny | CMS staff | — | deny (service) |
| `person_migration_audit` | deny | CMS staff | deny | deny (service) |
| `gathering_interest` | deny | staff (if policy) | deny | deny (service) |
| `retreat_applications` | deny | staff | deny | deny (service) |
| `events` | deny | CMS staff | deny | deny (service) |
| `event_participation` | deny | CMS staff* | deny | deny (service) |
| `event_lifecycle_audit` | deny | CMS staff | deny | deny (service) |
| `access_requests` | deny | users.assign | deny | deny (service public API) |
| `audit_logs` | deny | privileged | deny | deny (service) |
| `user_roles` / `roles` | deny | staff | deny | deny (service) |

\* Participation staff policies may be service-only until participation write path ships.

---

## Case matrix (pass/fail)

| # | Actor | Operation | Expected |
| - | ----- | --------- | -------- |
| 1 | anon | `select * from people` | 0 rows / policy deny |
| 2 | anon | `select * from profiles` | deny |
| 3 | anon | `insert into gathering_interest` | deny (use API + service) |
| 4 | authenticated_no_profile | `select people` | deny or empty |
| 5 | portal_only | `select people where id = own` | allow own only |
| 6 | portal_only | `select people` (all) | only own row |
| 7 | portal_only | `select event_lifecycle_audit` | deny |
| 8 | reviewer | `select people` | allow (CMS) |
| 9 | reviewer | `update people` | deny without policy |
| 10 | finance | `select retreat_applications` | per existing retreat RLS |
| 11 | programme_manager | `select events` | allow |
| 12 | programme_manager | `insert event_lifecycle_audit` | deny (service only) |
| 13 | super_admin | `select people, profiles, audit` | allow |
| 14 | service_role | insert interest + person link | allow |
| 15 | service_role | lifecycle transition upsert + audit | allow |

---

## SQL smoke snippets (run as each role JWT)

```sql
-- As authenticated staff
select count(*) from people;
select count(*) from person_migration_audit;
select count(*) from event_lifecycle_audit;

-- Expect fail for client role
insert into people (display_name, email_normalized)
values ('Test', 'should-fail@example.com');
```

Record results in a private ops log — do not commit PII.

---

## App-level authz (orthogonal to RLS)

| Endpoint | Permission |
| -------- | ---------- |
| `POST /api/events/[id]/lifecycle` | `events.edit` / `events.publish` |
| `GET /api/iam/team` | `users.view` |
| `POST /api/iam/invite` | `users.assign` |
| Public interest / apply | none (service role after validation) |

RLS is defence in depth; **every mutation API still calls `requireAuthz`**.

---

## Sign-off

| Item | Owner | Date |
| ---- | ----- | ---- |
| Matrix executed on staging/prod | | |
| Failures remediated | | |
| Super Admin MFA path planned | | |
| No `ALLOW_LOCAL_IAM` in production | | |
