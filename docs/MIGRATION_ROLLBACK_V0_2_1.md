# Migration Rollback Plan — v0.2.1 + Lifecycle

**Status:** Manual only  
**Last verified:** 2026-07-25  

Never auto-run destructive SQL against production. Prefer **restore from Supabase backup** over reverse DDL if data has been written.

---

## Apply order (forward)

1. `20260725_retreat_platform.sql`  
2. `20260726_iam_team_access.sql`  
3. `20260726_iam_phase1_access_control.sql`  
4. `20260726_gathering_interest.sql`  
5. `20260726_event_operations.sql`  
6. `20260726_v0_2_1_people_bootstrap.sql`  
7. `20260726_event_lifecycle_transition.sql`  

---

## Rollback philosophy

| Layer | Safe reverse? | Notes |
| ----- | ------------- | ----- |
| `person_migration_audit` | Drop table | Append-only log; no app dependency for public site |
| `person_relationships` | Drop after people | |
| `profiles.person_id` | Drop column | Loses link only |
| `gathering_interest.person_id` | Drop column | Source rows remain |
| `retreat_applications.person_id` | Drop column | Source rows remain |
| `people` | Drop last among person graph | Only if no FKs remain |
| `event_lifecycle_audit` | Drop table | Loses transition history |
| `events` | Keep if production content lives here | Prefer null lifecycle over drop |
| IAM `profiles` / `roles` | **Do not drop** if auth is live | Restore backup instead |

**Source records** (`gathering_interest`, `retreat_applications`) are never deleted by v0.2.1 migrations — only linked.

---

## Partial reverse (person graph only)

```sql
-- Review impact first
begin;

alter table gathering_interest drop column if exists person_id;
alter table retreat_applications drop column if exists person_id;
alter table profiles drop column if exists person_id;

drop table if exists person_migration_audit;
drop table if exists person_relationships;
drop table if exists people;

-- event participation FK may need drop first if present
-- alter table event_participation drop constraint if exists event_participation_person_id_fkey;

commit;
```

---

## Lifecycle-only reverse

```sql
begin;
alter table event_lifecycle_audit drop column if exists reason;
alter table event_lifecycle_audit drop column if exists meta;
-- keep base audit table from event_operations unless unused
commit;
```

---

## If production has live PII

1. Pause public form writes (feature flag / remove service role temporarily).  
2. Snapshot / PITR if available.  
3. Prefer restore over drop.  
4. Re-apply fixed migrations on a clean branch if schema is corrupt.  

---

## Mapping: source → person (no delete)

| Source | Link field | Match key |
| ------ | ---------- | --------- |
| `gathering_interest` | `person_id` | normalized email / WhatsApp |
| `retreat_applications` | `person_id` | `email_normalized` / `phone_e164` |
| `profiles` | `person_id` | email |
| Future `event_participation` | `person_id` | **only after** person resolved |

Participation writes remain **blocked** until person resolution succeeds (product rule).
