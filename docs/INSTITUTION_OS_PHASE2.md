# Phase 2 — Institutional Readiness

## Founder-Being as an Institution Operating System

**Version:** 1.0  
**Status:** Architecture & product direction (pre–v1.0 production)  
**Last verified:** 2026-07-25  

### Positioning

The platform is **design-complete and architecture-ready**. Remaining work before calling **v1.0 production-ready** is primarily:

1. **Security hardening** (authn, authz, MFA, RLS, audit) — see [IAM_PRODUCTION_ACCESS_CONTROL.md](./IAM_PRODUCTION_ACCESS_CONTROL.md)  
2. **Operational readiness** (runbooks, env, email, backups)  
3. **Institutional modules** described in this document  

This phase evolves Founder-Being from an **event management system** into an **institutional operating system (Institution OS)**.

| Product class | What it does |
| ------------- | ------------ |
| Website | Publishes information |
| CRM | Manages contacts |
| Event platform | Manages registrations |
| **Founder-Being OS** | Manages long-term relationships, programmes, governance, operations, communications, and institutional knowledge in one coherent system |

That distinction should guide every future decision. The architecture should scale from a handful of retreats in Kerala to a multi-country founder institution **without a fundamental rewrite**.

---

# Prerequisites (v1.0 gate)

Do not treat Phase 2 modules as live with real institutional data until Phase 1 production gates pass:

* `/admin` requires authenticated session  
* Every server action enforces permissions  
* Super Admin is database-bootstrapped (not email-matched)  
* Invitations are hashed, expiring, single-use  
* Access requests never auto-grant roles  
* MFA for privileged roles  
* Immutable audit log  
* RLS tested  
* Local IAM fallback disabled in production  

---

# 1. Organization Module

Today: users / team access.  
Needed: **Organizations** (groups) that people belong to.

```
Founder-Being
├── Executive Office
├── Founding Team
├── Patron Circle
├── Advisory Council
├── Programme Office
├── Community
├── Communications
├── Finance
├── Volunteers
├── Regional Chapters (future)
```

### Model

```
organizations
organization_members (person_id, organization_id, role_in_org, started_at, ended_at)
```

### Why

Groups enable **notifications, permissions scoping, reporting, communications, and committees** without redesign.

**Note:** Organizational membership is **not** the same as system access roles (IAM). A person may be in Patron Circle with system role `none`.

Related: [IAM_TEAM_ACCESS_PRD.md](./IAM_TEAM_ACCESS_PRD.md) (relationship vs system role).

---

# 2. People CRM

Every human exists **once**.

Not separate silos for applicants, patrons, volunteers, members.

```
Person
  ↓ Relationships (institutional)
  ↓ Organizations
  ↓ Events / Gatherings
  ↓ Applications
  ↓ Retreats
  ↓ Payments
  ↓ Communications
  ↓ Notes
  ↓ Tags
  ↓ Documents
```

One profile. One history. One timeline.

Think **Salesforce for community** — not a stack of event registration tables.

### Suggested core tables

```
people                    -- canonical person (may link profiles.auth when they have login)
person_relationships      -- patron, member, volunteer, … over time
person_tags
person_notes
person_documents
person_event_links        -- attendance, interest, invitation
person_application_links
person_payment_links
person_communication_links
```

Identity for CMS login remains `profiles` + IAM; **Person** is the broader institutional graph (including people who never log in).

---

# 3. Institutional Timeline

Every person automatically accumulates a **chronological timeline**. Nothing disappears.

Example:

```
May 2026     Requested access
             Joined Founder Meetup
             Applied for Retreat
             Waitlisted
             Attended Reflection Circle
             Introduced to Patron Circle
             Became Volunteer
             Invited to Advisory Council
```

### Model

```
person_timeline_events
  person_id
  occurred_at
  event_type        -- access_request, gathering_interest, application_status, attendance, …
  source_table
  source_id
  title
  summary
  meta jsonb
  visibility        -- internal | restricted
```

Writers: every domain mutation appends a timeline event (and an audit log where security-sensitive).

---

# 4. Internal Notes

Every person profile supports:

* Private notes  
* Pinned notes  
* Mentions (`@user`)  
* Attachments  
* Tasks / follow-ups  

Example:

```
Met Jimmy after Kochi meetup.
Interested in investor retreat.
Potential Patron.
Follow up September.
```

### Model

```
person_notes (body, pinned, created_by, created_at)
person_note_mentions
person_tasks (due_at, assignee, status, related_note_id)
```

---

# 5. Document Centre

Attach documents to **people, retreats, events**.

Examples: waivers, invoices, photos, contracts, meeting notes.

### Model

```
documents
  owner_type   -- person | retreat | gathering | organization
  owner_id
  storage_path -- private bucket
  title, mime, uploaded_by, created_at
```

Access via signed URLs + RLS. Never public buckets for personal docs.

---

# 6. Communication History

Not email alone — a unified, searchable stream:

```
Email → WhatsApp → Phone → Meeting → Internal Note
→ Invitation → Newsletter → Reminder
```

### Model

```
communications
  person_id (nullable for broadcasts)
  channel     -- email | whatsapp | phone | meeting | note | invitation | newsletter | reminder
  direction   -- inbound | outbound | internal
  subject, body_summary, occurred_at
  actor_profile_id
  meta jsonb
```

Everything indexed for ⌘K.

---

# 7. Event Operations Lifecycle

**Current:** Upcoming Gathering + interest forms.  

**Future stages:**

```
Planning → Published → Interest Collection → Applications
→ Selection → Invitations → Payments → Confirmed
→ Attendance → Feedback → Archived
```

### Model

```
gatherings / events
  stage enum (above)
  capacity, city, event_type, registration_workflow
  stage_changed_at, stage_changed_by
```

Interest submissions (`gathering_interest`) already carry `event_id` for CMS routing — see [GATHERINGS.md](./GATHERINGS.md).

Residential retreats remain a specialised programme type with richer application state (Kodaikanal PRD).

---

# 8. Financial Layer

**Separate from formal accounting.** Programme P&L awareness per event:

Budget · Expenses · Sponsors · Patrons · Revenue · Refunds · Scholarships · Deposits · Balance · Profit/Loss  

### Model

```
event_budgets
event_expenses
event_revenues
event_scholarships
-- payments already partially modelled for retreats (payment_records)
```

Public site never exposes internal costs (operational privacy).

---

# 9. Workflow Engine

Replace ad-hoc manual email with definable pipelines:

```
Application Approved
  → Invite Email
  → Payment Request
  → Reminder
  → Confirmed
  → Welcome Pack
  → WhatsApp Group
  → Post-event Survey
```

### Direction

* Phase 2a: explicit stage machines + checklist tasks  
* Phase 2b: no-code automation (triggers / actions) on the same event bus  

Never hardcode one-off email strings across the codebase without a template registry.

---

# 10. Dashboard — work, not vanity

Answer only: **What needs attention?**

Example:

```
12 applications waiting
3 payments overdue
2 patrons awaiting follow-up
1 invitation expires tomorrow
Retreat capacity 83%
Volunteer coordinator unresolved
```

Aligns with [ADMIN_DASHBOARD_DESIGN_PRD.md](./ADMIN_DASHBOARD_DESIGN_PRD.md) (Calm Operations).

---

# 11. Universal Search (⌘K)

Search everything:

People · Events · Notes · Communications · Applications · Retreats · Documents · Payments · Organizations  

Command palette already exists as a shell; Phase 2 indexes domain entities behind it.

---

# 12. AI Layer (assistive, human-final)

Every module may expose AI actions **without changing navigation**.

| Module | Examples |
| ------ | -------- |
| Applications | Summarize founder · Detect burnout signals · Recommend cohort · Suggest interviewer |
| Communications | Draft reply · Summarize thread · Generate invitation |
| People | Relationship summary · Recent interactions · Suggested follow-up |

Humans remain in control of approvals, payments, and role changes.

---

# 13. System Health

Dedicated page — green / yellow / red:

Authentication · Supabase · Email · Storage · Cron · Queue · Analytics · Payments · Integrations · Background jobs  

---

# 14. Security Dashboard

Surface, don’t bury:

Failed logins · Role changes · Exports · Invitation abuse · API errors · Sessions · MFA compliance  

Backed by immutable `audit_logs`.

---

# 15. Founder Journey

Long-term lifecycle (distinct from system roles):

```
Visitor → Interested → Community Member → Event Attendee
→ Retreat Applicant → Retreat Participant → Volunteer
→ Mentor → Patron → Advisory Council
```

The OS always knows **where someone currently sits** (`person_journey_stage` + history).

---

# Suggested final sidebar

```
Dashboard

People
    People
    Organizations
    Relationships

Community
    Gatherings
    Retreats
    Applications
    Attendance

Communications
    Email
    WhatsApp
    Announcements

Operations
    Tasks
    Documents
    Payments
    Reports

Insights
    Analytics
    Founder Journey
    AI Insights

Administration
    Team & Access
    Audit
    System Health
    Security
    Settings
```

Current shell implements a subset (Dashboard, Community, Retreats, Applications, Gatherings, Patrons, Communications, Content, Analytics, Team & Access, Settings). Phase 2 expands navigation **by grouping**, not by inventing parallel apps.

---

# Implementation sequencing (recommended)

| Order | Workstream | Outcome |
| ----- | ---------- | ------- |
| 0 | Phase 1 security gates | Safe to store real data |
| 1 | **Person** canonical model + merge paths from interest/applications | One profile graph |
| 2 | Timeline writers on existing mutations | Automatic history |
| 3 | Notes + tasks on person | Operator follow-ups |
| 4 | Organizations + membership | Committees / chapters ready |
| 5 | Communications log | Searchable multi-channel history |
| 6 | Event stage machine | Full gathering lifecycle |
| 7 | Documents (private storage) | Waivers, packs, contracts |
| 8 | Financial layer (event-scoped) | Programme P&L |
| 9 | Workflow engine / templates | Reduced manual email |
| 10 | Attention dashboard + ⌘K index | Daily ops |
| 11 | System Health + Security views | Run reliability |
| 12 | Journey stage + AI assists | Institutional intelligence |

---

# Architectural principles

1. **One person, many relationships** — never duplicate humans per programme.  
2. **Append-only history** — timeline + audit; soft-close, don’t erase.  
3. **IAM ≠ CRM** — system roles control the console; relationships describe the institution.  
4. **Events as stages** — every gathering is a lifecycle, not a static card.  
5. **Private by default** — documents, notes, PII behind RLS and signed access.  
6. **Attention over metrics** — dashboards create work queues.  
7. **AI as assist** — never auto-approve, auto-pay, or auto-elevate roles.  
8. **One OS** — no parallel micro-apps that fragment the person graph.  

---

# Related documents

| Doc | Role |
| --- | ---- |
| [IAM_PRODUCTION_ACCESS_CONTROL.md](./IAM_PRODUCTION_ACCESS_CONTROL.md) | Security gates before real data |
| [IAM_TEAM_ACCESS_PRD.md](./IAM_TEAM_ACCESS_PRD.md) | Team & Access / RBAC |
| [ADMIN_DASHBOARD_DESIGN_PRD.md](./ADMIN_DASHBOARD_DESIGN_PRD.md) | Calm Operations UI |
| [RETREAT_PLATFORM_MVP.md](./RETREAT_PLATFORM_MVP.md) | Retreat product scope |
| [GATHERINGS.md](./GATHERINGS.md) | Public gatherings + interest CMS tags |
| [TYPOGRAPHY.md](./TYPOGRAPHY.md) | Public brand typography |

---

# Overall assessment

From the retreat platform, IAM, institutional branding, interest registrations, and event workflows already in place, Founder-Being is evolving beyond a typical community website into an **Institution Operating System**.

If every feature is chosen by that philosophy—rather than as one-off pages—the platform can grow from Kerala retreats to a multi-country founder institution without discarding its core graph: **people, programmes, governance, and memory**.
