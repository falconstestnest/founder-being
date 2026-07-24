# v0.2.1 — Production Identity and Person Bootstrap

**Status:** Implementation slice of [OS v0.2 Secure People Foundation](./OS_V0_2_SECURE_PEOPLE_FOUNDATION.md)  
**Last verified:** 2026-07-25  

This is the **right bottleneck**. Everything else stays downstream until this slice answers yes.

---

## Milestone boundary

```text
Secure access
  → Canonical Person
  → Institutional timeline          ← blocked until v0.2.1 complete
  → Event participation links
  → Attention queues
```

**Blocked until completion:** timeline UI, communications centre, documents, payments, operational dashboards fed by real people data.

---

## Core relationship (locked)

```text
auth.users
    ↓
profiles          ← authenticated access identity (IAM)
    ↓
people            ← institution’s canonical human record (CRM identity)
    ↓
person_relationships
    ↓
event_participation / retreat_applications / gathering_interest
```

### Critical distinction

| Entity | Role |
| ------ | ---- |
| **`profiles`** | Login / access identity. System roles, MFA, status, workspace routing. **Not** the CRM record. |
| **`people`** | Canonical human in the institution. Interest, applications, relationships, source history. |
| **`person_relationships`** | Institutional relationship layers (patron, member, volunteer, …) — views around one person. |

A person may exist **without** a profile (public applicant).  
A profile should link to **exactly one** person when active.

---

## Scope (v0.2.1 only)

1. Production Supabase project + environment separation (docs + env contract)  
2. Authenticated user bootstrap (`auth_user_id` on profile)  
3. Protected Super Administrator setup  
4. `profiles` + canonical `people` schema  
5. User → person linking (`profiles.person_id`)  
6. Normalized email and WhatsApp identity fields  
7. Duplicate detection rules (no name-only merge)  
8. Migration of `gathering_interest` (interest registrations)  
9. Migration of `retreat_applications`  
10. Person linkage for **new** event interest / retreat applications  
11. RLS policies + role-based test matrix (documented + SQL)  
12. Append-only `person_migration_audit` records  

### Explicitly out of scope

* Institutional timeline UI  
* Communications / documents / payments  
* Attention queues product UI  
* Manual merge UI (rules + audit flags only)  
* Parallel “people per event” tables  

---

## Duplicate detection rules

Automatic link (in order):

1. `profiles.auth_user_id` → existing person via `profiles.person_id`  
2. Exact match on `people.email_normalized`  
3. Exact match on `people.whatsapp_normalized` (E.164-ish)  

If email matches person A and WhatsApp matches person B → **conflict**: attach via email, write audit `merge_conflict`, never auto-merge.

**Never** match on similar names alone.

---

## Completion test

> Can Founder-Being open **one person record** and reliably see their authenticated identity, event interest, retreat applications, institutional relationships, and source history **without duplicating them**?

Until yes: no timeline, communications, documents, payments, or attention dashboards on real data.

Admin surface for the test: `/admin/people` · `/admin/people/[personId]`

---

## Environment separation

| Env | Purpose |
| --- | ------- |
| Local / Preview | Dev Supabase or unset service role; no production PII |
| Production | Dedicated Supabase project; Vercel Production env only |

Never share production service role with preview.  
Never enable `ALLOW_LOCAL_IAM` in production.

Contract: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`, `SUPABASE_SERVICE_ROLE_KEY`, `SUPER_ADMIN_EMAIL`

---

## Super Administrator bootstrap

1. Create auth user in Supabase Auth for `SUPER_ADMIN_EMAIL`  
2. Ensure `profiles` row: `is_super_admin`, `protected`, `status=active`  
3. Assign `super_administrator` role  
4. First sign-in links `auth_user_id` and creates/links `people` row  
5. Never grant by email match at runtime  

SQL seed already targets `jimmymanalel@gmail.com` — bootstrap links auth user on first login.

---

## Implementation map

| Piece | Path |
| ----- | ---- |
| Schema | `supabase/migrations/20260726_v0_2_1_people_bootstrap.sql` |
| Find/create person | `src/lib/people/personService.ts` |
| Duplicate rules | `src/lib/people/duplicateRules.ts` |
| Identity normalize | `src/lib/identity/normalize.ts` |
| Interest linkage | `src/app/api/events/interest/route.ts` |
| Application linkage | `src/app/api/retreats/apply/route.ts` |
| Profile ↔ person | `src/lib/people/ensureProfilePerson.ts` |
| Admin person view | `src/app/admin/people/**` |
| Parent milestone | [OS_V0_2_SECURE_PEOPLE_FOUNDATION.md](./OS_V0_2_SECURE_PEOPLE_FOUNDATION.md) |

---

## Acceptance checklist

- [ ] Production Supabase project configured; preview separated  
- [ ] Super Admin can sign in; profile has `auth_user_id` + `person_id`  
- [ ] `people` table is source of CRM identity; `profiles` is access only  
- [ ] New interest rows set `person_id`  
- [ ] New retreat applications set `person_id`  
- [ ] Backfill migration audited in `person_migration_audit`  
- [ ] Same email cannot create a second person without merge conflict audit  
- [ ] `/admin/people/[id]` shows profile link, interest, applications, relationships  
- [ ] RLS: anon cannot read people; staff needs permission; service role writes public forms  
- [ ] Timeline / comms / payments still not storing parallel people  

---

## After v0.2.1

Only then:

1. Append-only institutional timeline events  
2. Event participation fully on Person  
3. Attention queues  
4. Communications, documents, finance  
