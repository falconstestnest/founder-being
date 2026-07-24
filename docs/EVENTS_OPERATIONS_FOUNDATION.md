# Events Operations Foundation

**Status:** Shell implemented · catalogue-backed  
**Milestone:** Narrower than full Institution OS — operational shell around unified Event  
**Last verified:** 2026-07-25  

Related: [EVENTS_DOMAIN.md](./EVENTS_DOMAIN.md) · [OS_V0_2_SECURE_PEOPLE_FOUNDATION.md](./OS_V0_2_SECURE_PEOPLE_FOUNDATION.md)

---

## Locked architecture

```text
Event
  → Type
  → Workflow
  → Participation
  → People
  → Operations
  → Analytics
```

One scalable model for retreats, meetups, investor dialogues, side events, reflection circles, and future summits.

**Rule:** No new feature may introduce separate retreat or gathering data models.

---

## Admin routes

```text
/admin/events
/admin/events/new
/admin/events/[eventId]?tab=
```

### Tabs (workflow-aware)

| Workflow | Tabs |
| -------- | ---- |
| Application (e.g. Kodaikanal) | Overview · Applications · Participants · Payments · Communications · Operations · Documents · Settings |
| Interest / Interest list | Overview · Interest · Invitations · Participants · Communications · Operations · Documents · Settings |
| Invitation | Overview · Interest · Invitations · Participants · … |
| Invitation application | Overview · Applications · Invitations · Participants · Payments · … |

Implementation: `src/lib/events/adminTabs.ts`

---

## Overview answers

> What needs attention for this event?

Shows: lifecycle, workflow, capacity, interested, applied, invited, confirmed, paid, waitlisted, declined, attended, open tasks, deadlines, recent activity.

No decorative charts.

---

## Lifecycle (guarded)

```text
Draft → Planning → Published
  → Interest Collection / Applications Open
  → Selection → Confirmed → Live → Completed → Archived
```

Validation examples (code in `src/lib/events/lifecycle.ts`):

* Publish requires title, dates, workflow, location, CTA, public copy  
* Applications Open requires application workflow + form path  
* Live before start date requires authorized override  
* Archive blocked by unresolved refunds / active follow-ups (hooks ready)  

Every transition must write `event_lifecycle_audit` (schema ready).

---

## Participation model

```text
event_participation
  person_id
  event_id
  source
  status
  workflow_stage
  invited_at / confirmed_at / paid_at / attended_at
  created_at / updated_at
```

Statuses: Interested · Applied · Under Review · Waitlisted · Invited · Confirmed · Payment Pending · Paid · Declined · Cancelled · Attended · No Show  

Workflow determines valid statuses (`WORKFLOW_STATUSES`).

**Counts are derived** from participation rows — not primary source of truth.

---

## Duplicate event

Copy optionally: public content, agenda, form, capacity, comms templates, checklist, documents, team.

**Never copy:** participants, applications, payments, audit, sent communications, analytics.

`buildDuplicateDraft()` in `src/lib/events/adminData.ts`

---

## Admin navigation

Primary: **Events** (`/admin/events`)

Deprecated pointers only:

* Retreats → Events (type filter)  
* Gatherings → Events  

---

## Create event (guided)

```text
1 Basics → 2 Type & workflow → 3 Date & location
→ 4 Capacity → 5 Public content → 6 Form
→ 7 Review → 8 Publish
```

Scaffold: `/admin/events/new`

---

## Acceptance criteria

| Criterion | Status |
| --------- | ------ |
| Every public event maps to one admin record | ✅ Catalogue IDs |
| CTA submissions resolve to event ID | ✅ `/api/events/interest` |
| Event detail permission-aware | ⏳ Tabs shown; full authz when session+profile live |
| Lifecycle transitions validated | ✅ Logic ready; UI lists next stages |
| Participation workflow-aware | ✅ Status sets per workflow |
| Capacity derived | ✅ `deriveCapacity()` |
| Safe duplicate rules | ✅ Documented + draft builder |
| No parallel retreat/gathering models | ✅ Enforced in docs/nav |
| Legacy routes resolve | ✅ Public redirects/rewrites |
| Person timeline attach-ready | ✅ `person_id` on participation schema |

---

## Code map

| Piece | Path |
| ----- | ---- |
| List | `src/app/admin/events/page.tsx` |
| Detail | `src/app/admin/events/[eventId]/page.tsx` |
| Tabs | `src/lib/events/adminTabs.ts` |
| Lifecycle | `src/lib/events/lifecycle.ts` |
| Participation | `src/lib/events/participation.ts` |
| Admin data | `src/lib/events/adminData.ts` |
| SQL | `supabase/migrations/20260726_event_operations.sql` |

---

## Next after this foundation (sequencing locked)

```text
1. Production Supabase + security gate
2. Canonical Person (v0.2.1)
3. Interest/application identity linking (done in code; needs prod DB)
4. event_participation writes (only after person_id resolves)
5. Person timeline
6. Attention dashboard
```

### Safe parallel (Event entity only)

| Item | Status |
| ---- | ------ |
| `POST /api/events/[eventId]/lifecycle` | ✅ Guaranteed transitions + audit |
| Admin UI transition controls | ✅ |
| `event_lifecycle_audit` reason | ✅ migration |

### Explicitly blocked until Person gate

* interest → `event_participation` rows  
* participant creation  
* payments / invitations / communications automation  

Person completion test: [OS_V0_2_1](./OS_V0_2_1_PRODUCTION_IDENTITY_PERSON_BOOTSTRAP.md) · RLS: [RLS_TEST_MATRIX.md](./RLS_TEST_MATRIX.md)
