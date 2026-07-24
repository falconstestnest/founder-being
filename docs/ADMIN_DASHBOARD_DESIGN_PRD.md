# Founder-Being Admin Dashboard

## Product Design Requirements Document (UI/UX)

**Version:** 1.0  
**Status:** Design PRD  
**Design Philosophy:** Calm Operations  
**Last verified:** 2026-07-25  

Related product docs:

* [Retreat Platform product handoff](./RETREAT_PLATFORM_MVP.md)
* [Kodaikanal implementation PRD](./Founder_Being_Kodaikanal_Retreat_Signup_PRD.md)

---

# Vision

The Founder-Being dashboard is **not an admin panel.**

It is the operational home of Founder-Being.

Every screen should feel intentional, quiet and trustworthy.

The experience should resemble products like **Linear**, **Notion**, **Vercel**, and **Stripe**, where simplicity reduces cognitive load and helps users focus on decisions rather than navigating software. Purpose-built dashboards with restrained layouts, clear hierarchy, and modular information outperform dense collections of widgets.  
(Reference: [Linear — dashboard best practices](https://linear.app/now/dashboards-best-practices))

---

# Design Principles

## 1. Calm First

No unnecessary colours.  
No visual noise.  
No animations that don't communicate state.

The dashboard should lower stress—not create it.

## 2. Information Before Decoration

Every component must answer one question.

If a card doesn't help make a decision… remove it.

## 3. Everything Searchable

Never force users through deep navigation.

**Universal Search (⌘K)** should search:

* founders  
* applications  
* events  
* payments  
* patrons  
* notes  
* communications  

## 4. Every Page Has One Primary Action

Example — Applications:

Primary action: **Review Application**

Not a row of Edit · Delete · Export · Settings.

## 5. Progressive Disclosure

Don't overwhelm. Only reveal complexity when needed.

Application → Basic Profile → Expand → Reflection Answers → Expand → Payment History → Expand → Internal Notes

## 6. Tables Are Products

Every table should include:

* search  
* filters  
* sorting  
* bulk actions  
* keyboard navigation  
* saved views  

Large operational tables work best with filtering and drill-down rather than displaying every field at once.  
(Reference: [Notion — Dashboards](https://www.notion.com/en-gb/help/dashboards))

---

# Design Language

**Inspired by**

* Linear  
* Notion  
* Stripe Dashboard  
* GitHub  
* Vercel  

**Not inspired by**

* Bootstrap admin templates  
* Material Dashboard clones  
* Analytics dashboards full of charts  

---

# Colour System

| Token | Value | Use |
| ----- | ----- | --- |
| Background (Founder Midnight) | `#0B0B0B` | Page canvas |
| Cards | `#131313` | Surfaces |
| Border | `#222222` | Dividers, outlines |
| Primary text | `#FFFFFF` | Headings, primary content |
| Secondary text | `#A1A1AA` | Meta, labels |
| Accent (Founder Gold) | `#FFAB33` (CMYK 01 / 42 / 91 / 00) | Status highlights, primary buttons, active nav, approvals |

**Gold only for:** status highlights, buttons, active navigation, approvals.  
**Never use gradients.**

---

# Typography

| Role | Face |
| ---- | ---- |
| Headings | Inter SemiBold |
| Body | Inter Regular |
| Numbers | IBM Plex Mono |

---

# Layout

| Measure | Value |
| ------- | ----- |
| Maximum width | 1600px |
| Sidebar | 280px |
| Content | Fluid |
| Padding | 32px |
| Spacing | 8-point system throughout |

---

# Navigation

**Sidebar**

* Dashboard  
* Community  
* Retreats  
* Applications  
* Gatherings  
* Patrons  
* Communications  
* Content  
* Analytics  
* —  
* **Team & Access** (IAM — not a simple Users page)  
* Settings  

**Bottom**

* Help  
* Profile  

See [IAM_TEAM_ACCESS_PRD.md](./IAM_TEAM_ACCESS_PRD.md).

---

# Dashboard Home

**Purpose:** answer *“What requires attention today?”*  
Nothing else.

### Top row

Today's date · Greeting · Search · Notifications  

### KPI cards

Applications · Pending Review · Deposits Received · Seats Filled · Upcoming Events · Messages  

### Second row

Applications requiring review · Upcoming calls · Today's tasks  

### Third row

Retreat timeline · Founder activity · Recent communications  

No charts unless useful. Operational dashboards should prioritise actions over decorative visualisations.

---

# Applications

**Split layout**

* Left — Application list  
* Right — Application detail  

Never open new pages for detail.

### Application detail (progressive)

Founder · Company · Role · LinkedIn → Intent → Reflection → Notes → Payment → History  

**Sticky action bar:** Approve · Waitlist · Reject  

---

# Retreats

Each retreat as a **card**: Status · Capacity · Applications · Revenue · Timeline · **Manage**

**Inside a retreat:** Programme · Applicants · Payments · Communications · Settings  

---

# Founder Profile

Single page: profile photo · company · city · founder status · past events · applications · payments · notes · communication history.

---

# Communications

Timeline of calls · emails · WhatsApp · notes — chronological, every interaction.

---

# Patrons

Simple CRM: Patron · Organisation · Contribution · Status · Meetings · Notes · Recognition  

---

# Analytics

Minimal: Applications · Conversion · Selection · Attendance · Revenue · Geography · Source  

Avoid decorative graphs. Use **numbers first**.

---

# Notifications

Never use popups.

**Notification Center** — right panel, grouped: Today · Yesterday · Earlier  

---

# Search

Global **⌘K** · Instant · Search everything · Open results without full page navigation  

---

# Mobile

Not feature complete. Only:

* Review  
* Search  
* Approve  
* Communicate  

---

# Empty States

Never blank.

Example: *No applications yet. Applications will appear here once founders begin applying.*

---

# Loading

Skeleton UI. No spinners.

---

# Errors

Human language.

Not: `500`  
Instead: *We couldn't load this information. Please try again.*

---

# Accessibility

WCAG AA · Keyboard first · Visible focus · High contrast · Screen-reader labels · Reduced motion  

---

# Motion

150ms · Fade · Slide · Nothing playful  

---

# Performance

Every page &lt; 1 second perceived load · Optimistic updates · Background refresh  

---

# Permissions

| Role | Access |
| ---- | ------ |
| Owner | Full access |
| Programme Lead | Applications, events, communication |
| Finance | Payments, reports — no editing applications |
| Reviewer | Applications only |
| Volunteer | Read-only, limited |

---

# Component Library

Use: Cards · Tables · Command palette · Drawer · Modal · Toast · Badge · Avatar · Tabs · Timeline · Empty state · Activity feed  

Nothing custom unless necessary.

---

# Future AI Layer

The interface should allow AI features without changing navigation or layout.

Examples:

* Application summaries  
* Suggested reviewer notes  
* Founder sentiment analysis  
* Retreat cohort recommendations  
* Communication drafting  
* Operational insights  

Assistive only — humans remain in control of final decisions.

---

# Success Criteria

A first-time administrator should be able to:

* Find any founder in under **5 seconds**  
* Review an application in under **3 minutes**  
* Record a payment in under **30 seconds**  
* Locate any retreat in under **10 seconds**  
* Understand what requires attention within **5 seconds** of opening the dashboard  

Keep the number of dashboards small, make each page purpose-driven, present key information above the fold, and let users progressively drill into details.

---

# Design References

Adopt **principles**, not visual clones:

| Product | Principle |
| ------- | --------- |
| **Linear** | Speed, keyboard-first navigation, clean hierarchy |
| **Notion** | Modular layouts and progressive disclosure |
| **Stripe Dashboard** | Operational clarity and information density |
| **Vercel** | Restrained visual language and focused workflows |
| **GitHub** | Activity history and auditability |

---

# Implementation Notes (repo)

| Item | Location |
| ---- | -------- |
| Design tokens (admin) | `src/app/admin/admin.css` |
| Shell layout | `src/app/admin/layout.tsx` |
| Dashboard home | `src/app/admin/page.tsx` |
| Section placeholders | `src/app/admin/*/page.tsx` |
| Auth | Deferred — Supabase Auth + `admin_profiles` (see retreat SQL migration) |

Admin routes must remain **noindex** and authentication-protected before production use.

---

# Next Build Phases

1. **Shell** — layout, navigation, home attention surface, ⌘K scaffold (current)  
2. **Applications** — split list/detail wired to Supabase applications  
3. **Payments** — finance recording against `payment_records`  
4. **Retreat manage** — configuration, capacity, timeline  
5. **Auth & roles** — Supabase Auth, RLS-enforced permissions  
6. **AI assist layer** — non-blocking summaries and drafts  

This Design PRD is the source of truth for UI/UX decisions. Product workflow detail remains in the Retreat Platform and Kodaikanal PRDs.
