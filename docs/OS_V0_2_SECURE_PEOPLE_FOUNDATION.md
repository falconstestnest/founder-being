# Founder-Being OS v0.2 — Secure People Foundation

**Status:** Next milestone (authoritative execution order)  
**Last verified:** 2026-07-25  

**First implementation slice:** [v0.2.1 Production Identity and Person Bootstrap](./OS_V0_2_1_PRODUCTION_IDENTITY_PERSON_BOOTSTRAP.md)

```text
Secure access → Canonical Person → Timeline → Event links → Attention queues
```

Until v0.2.1 completion test passes **in production**, timeline, communications, documents, payments, and attention dashboards stay blocked.

**Events Operations** is structurally complete enough to pause. Do **not** expand `event_participation` writes until Person resolution works in production.

**Safe parallel Events path only:** lifecycle transition API + `event_lifecycle_audit` (Event entity — not Person).

## Why this milestone exists

The architecture is now **coherent and well-sequenced**. The strongest decision is the separation between:

| Phase | Focus |
| ----- | ----- |
| **Phase 1** | Security and production access control |
| **Phase 2** | Institution-wide data, workflows, and memory |

That order prevents sophisticated CRM and event features from being built on an insecure base.

**Current maturity (product assessment):** ~9.4/10 for foundation and documentation.  
**Primary remaining risk:** Implementing too many Phase 2 modules before securing and stabilizing the **Person graph**.

---

## What is already strong

### Public experience

Typography is launch-suitable:

* Semantic type scale  
* Readable editorial line length  
* Consistent vertical rhythm  
* Accessible text contrast  
* Deliberate list styling  
* Narrative / quote / key-statement patterns  
* Mobile-safe body sizing  
* Consistent interaction and focus states  

`text-fb-*` aliases during migration remain correct: no risky all-at-once refactor.

### Product architecture

Institution OS model (do not dilute):

```text
Person
  → relationships
  → programmes / events
  → participation
  → communications
  → payments
  → documents
  → notes
  → institutional timeline
```

**Central rule:** Applicants, patrons, volunteers, members and founders are **views or relationships** around one person record — not independent people databases.

---

## Milestone scope: Secure People Foundation

### In scope

1. **Production security gate complete** (executable checklist below)  
2. **Canonical Person graph**  
3. **Deduplication** (email, normalized WhatsApp, verified identity)  
4. **Relationship types** (institutional)  
5. **Institutional timeline** (append-only)  
6. **Permission-aware person profile**  
7. **Migration** of existing gathering interest + retreat applications into Person links  

### Explicitly out of scope (after v0.2)

* Full communications centre  
* Document centre at scale  
* Workflow automation engine  
* Full finance / P&L layer  
* AI assistants  
* Parallel Phase 2 modules built “everywhere at once”  

---

## Execution order (do not parallelize Phase 2)

### 1. Finish the production security gate

Complete and **prove** (not only document):

| # | Gate | Pass criteria |
| - | ---- | ------------- |
| 1 | Supabase production project | Project live; env on Vercel Production |
| 2 | Auth bootstrap | Super Admin can sign in; profile linked via `auth_user_id` |
| 3 | MFA for privileged users | Super Admin, Admin, Finance, Programme Manager required |
| 4 | Authz on every protected route & server action | `requireAuthz` (or equivalent) on all `/admin`, workspaces, mutations |
| 5 | Invitation acceptance + membership activation | Token hash, expiry, single-use, email match, activates profile+role |
| 6 | Session revocation | Sign out device / all; revoke on suspend |
| 7 | RLS test matrix | Anon / reviewer / finance / owner scripts pass |
| 8 | Immutable audit records | Writes for login, role, invite, export, payment; no CMS delete |
| 9 | Audit interface | Operators can view security-relevant events |
| 10 | No local fallbacks in production | `.data/` / `ALLOW_LOCAL_IAM` impossible in prod |
| 11 | Secrets hygiene | Only publishable key client-side; service role server-only |

Related: [IAM_PRODUCTION_ACCESS_CONTROL.md](./IAM_PRODUCTION_ACCESS_CONTROL.md)

### 2. Build the canonical Person model

First Institution OS feature after security.

Connect into **one** `people` (or equivalent) entity:

* Gathering / event interest  
* Retreat applications  
* Users / profiles (login)  
* Patrons, members, volunteers, attendees  
* Communication recipients  

**Dedup rules:**

* Normalized email (primary match)  
* Normalized E.164 WhatsApp/phone  
* Verified identity when available  
* Manual merge UI for conflicts  

### 3. Institutional timeline

Every meaningful action appends:

```text
Expressed interest · Applied · Invited · Approved · Paid
Attended · Reviewed · Volunteered · Became a patron
Received communication · Profile updated
```

Append-only. Record: **source, actor, related entity, timestamp**.

### 4. Unify programmes and events

Public surfaces may differ (retreat page vs meetup card).  
Internally converge on shared programme/event model (already started in [EVENTS_DOMAIN.md](./EVENTS_DOMAIN.md)):

```text
Programme / Event
  type · workflow · capacity · dates · venue
  people · applications · interest · payments
  communications · documents · tasks · status
```

### 5. Attention dashboard

Only after relationships are reliable.

Surface work, not vanity metrics:

* Applications awaiting review  
* Invitations nearing expiry  
* Overdue payments  
* Events approaching capacity  
* Unresolved tasks  
* Patron follow-ups  
* Security exceptions  
* Failed automations  

---

## Implementation rule (every Phase 2 feature)

Before approving any new feature, answer:

1. **Which canonical entity owns this data?**  
2. **Does this action create a timeline event?**  
3. **Which permission is required to perform or view it?**  

If any answer is unclear, do not ship.

---

## Success criteria for v0.2

* [ ] Security gate checklist all green in production  
* [ ] Every interest + retreat application rows link to a Person  
* [ ] Duplicate email cannot create a second Person without merge  
* [ ] Person profile shows relationships + timeline (permission-aware)  
* [ ] Events remain one domain (no new siloed “people per event” tables)  
* [ ] No production path uses local file IAM/store fallbacks  

---

## Document hierarchy (do not reorder casually)

| Layer | Doc |
| ----- | --- |
| Brand / type | [TYPOGRAPHY.md](./TYPOGRAPHY.md), [LOGO_PLACEMENT.md](./LOGO_PLACEMENT.md) |
| Public site & events | [EVENTS_DOMAIN.md](./EVENTS_DOMAIN.md), [GATHERINGS.md](./GATHERINGS.md), retreat PRDs |
| IAM & login | [IAM_TEAM_ACCESS_PRD.md](./IAM_TEAM_ACCESS_PRD.md), [INSTITUTIONAL_LOGIN_WORKSPACES.md](./INSTITUTIONAL_LOGIN_WORKSPACES.md) |
| **Security gate** | [IAM_PRODUCTION_ACCESS_CONTROL.md](./IAM_PRODUCTION_ACCESS_CONTROL.md) |
| **This milestone** | **OS_V0_2_SECURE_PEOPLE_FOUNDATION.md** |
| **v0.2.1 first slice** | [OS_V0_2_1_PRODUCTION_IDENTITY_PERSON_BOOTSTRAP.md](./OS_V0_2_1_PRODUCTION_IDENTITY_PERSON_BOOTSTRAP.md) |
| Long-term OS | [INSTITUTION_OS_PHASE2.md](./INSTITUTION_OS_PHASE2.md) |

---

## Bottom line

The project is documented with the right hierarchy: brand system, public website, event workflows, IAM, production access control, and Institution OS architecture.

**Next risk is not design inconsistency** — it is implementing too many Phase 2 modules before the Person graph is secured and stable.

**Ship v0.2 Secure People Foundation first.** Only then expand communications, documents, automation, finance, and AI.
