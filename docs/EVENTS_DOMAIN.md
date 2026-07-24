# Events Domain

**Status:** Architecture implemented (public hub + catalogue)  
**Last verified:** 2026-07-25  

Founder-Being uses a **single Events domain** for retreats, meetups, dialogues, side events, and summits. The CMS distinguishes experiences via `event_type` and `registration_workflow`—not separate modules.

---

## Public URL structure

```
/events
/events/kodaikanal-full-moon-retreat-2026
/events/trivandrum-meetup-2026
/events/capital-and-clarity-2026
/events/founder-reset-huddle-2026
/events/dubai-ecosystem-day-2026
/events/interest?event={slug}
```

Redirects:

* `/gatherings/interest` → `/events/interest`
* `/retreats/kodaikanal-full-moon-2026` → `/events/kodaikanal-full-moon-retreat-2026` (then rich programme page)

---

## Events Hub filters

| Tab | Purpose |
| --- | ------- |
| Upcoming | Active / upcoming programmes |
| Applications Open | Application workflows accepting applicants |
| Interest List | Interest / waitlist collection |
| Past Gatherings | Completed |
| Coming Soon | Planning / early announcement |

---

## Locked enums

**Event types:** Retreat · Community Meetup · Reflection Circle · Leadership Dialogue · Founder Dinner · Founder Walk · Investor Dialogue · Conference Side Event · Workshop · Summit · Online Session · Founder–Investor Retreat · Ecosystem Gathering  

**Status badges:** Applications Open · Interest List · Invitation Only · Planning · Sold Out · Waitlist · Completed · Draft  

**Lifecycle:** Draft → Planning → Published → Interest Collection → Applications Open → Selection → Confirmed → Live → Completed → Archived  

**Themes:** Founder Wellbeing · Leadership · Capital · Fundraising · Mindfulness · Purpose · Growth · Community · Investor Relations · Resilience  

**Registration workflows:** Interest · Interest List · Application · Invitation · Invitation Application · Community Signup  

Source: `src/lib/events/taxonomy.ts` · Catalogue: `src/lib/events/catalog.ts`

---

## Capacity intelligence (CMS fields)

```
capacity | applications | invited | confirmed | paid
waitlisted | declined | attended | no_show
```

Public cards may show capacity; full KPIs power the event dashboard later.

---

## Location model

```
country | state | city | venue | venue_public | timezone
```

---

## Registration tagging

Interest forms always submit:

* `event_id`
* `event_name`
* `event_type`
* `city`
* `registration_workflow`

API: `POST /api/events/interest` → `gathering_interest` table (compatible name until rename).

---

## Event dashboard (admin)

**Implemented shell:** [EVENTS_OPERATIONS_FOUNDATION.md](./EVENTS_OPERATIONS_FOUNDATION.md)

```text
/admin/events
/admin/events/[eventId]?tab=overview|applications|interest|…
```

Workflow-aware tabs. Capacity derived from participation. Lifecycle transitions guarded.

Also planned: full create/duplicate UI, post-event pipeline, Person timeline attach (OS v0.2).

---

## Domain model

```
Event
  → Event Type (enum)
  → Registration Workflow (enum)
  → Status Badge + Lifecycle
  → Themes[]
  → Location + Capacity
  → Applications / Interest / Invitations
  → People
  → Communications
  → Operations
  → Analytics
```

Examples:

| Event | Type | Workflow |
| ----- | ---- | -------- |
| Kodaikanal Full Moon | Retreat | Application |
| Trivandrum Meetup | Community Meetup | Interest |
| Capital & Clarity | Founder–Investor Retreat | Invitation Application |
| Huddle Week Reset | Conference Side Event | Interest List |
| UAE Ecosystem Day | Ecosystem Gathering | Invitation |
