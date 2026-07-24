# Retreat Platform

The Founder-Being website includes a dedicated **Retreat Platform** designed to support application-based residential retreats. The first implementation powers the **Kodaikanal Full Moon Retreat (26–31 August 2026)** through a secure, curated application workflow.

The retreat experience is intentionally separate from the homepage, with each retreat receiving its own dedicated landing page.

**Live Route**

`/retreats/kodaikanal-full-moon-2026`

The retreat page is linked from the **Upcoming Gatherings** section as the featured upcoming residential experience.

**Last verified:** 2026-07-25

---

# Product Documentation

The retreat platform is documented as a standalone product within the Founder-Being documentation.

| Document | Purpose |
| -------- | ------- |
| `docs/RETREAT_PLATFORM_MVP.md` | Product vision, guiding principles, MVP scope, privacy model, and future roadmap (this document) |
| `docs/Founder_Being_Kodaikanal_Retreat_Signup_PRD.md` | Complete implementation PRD covering UX, workflows, database design, security, SEO, and operational requirements |

Documentation is indexed through:

* `docs/README.md`
* `AGENTS.md` documentation map

---

# Core Product Principles

* **Application-first experience** — founders apply to attend rather than purchasing a ticket immediately.
* **Curated cohort selection** — every application is reviewed personally before an invitation is extended.
* **Private payment workflow** — payments are collected only after approval and direct communication.
* **Founder privacy by design** — personal information is securely stored and accessible only to authorized administrators.
* **Operational flexibility** — event confirmation, pricing, deadlines, and capacity remain configurable without requiring code changes.

---

# Public Retreat Experience

The Kodaikanal retreat page includes:

* Hero section with key retreat information
* Application-first call-to-action (**Apply to Attend**)
* Retreat purpose and who should apply
* Lead facilitator section (shown only after written confirmation)
* Tentative day-by-day programme
* What's included and excluded
* Pricing and reservation deposit information
* Founder selection process
* Important dates and milestones
* Frequently Asked Questions
* Mobile-first three-step application form
* Wellbeing, privacy, and cancellation notices
* Search engine optimisation with Schema.org Event JSON-LD and sitemap integration

The MVP intentionally excludes public ticket purchasing or instant checkout.

---

# Application & Selection Workflow

Applications follow a curated lifecycle:

Submission → Review → Shortlisting → Selection → Personal contact → Deposit collection → Final payment → Retreat confirmation

Selection considers founder fit, intent, willingness to participate, cohort diversity, and community contribution—not solely company size, funding, or public profile.

**Capacity (this event):** maximum **15** founders; minimum viable cohort **12** paid founders. The retreat proceeds only after the minimum is achieved.

**Payment (MVP):** selected founders are contacted personally by **3 August 2026**; payment instructions are shared privately (WhatsApp or email); reservation deposit **₹15,000**; remaining balance after official confirmation. No online payment gateway in the first release.

---

# Backend (MVP)

The backend provides the foundation for the Founder-Being retreat platform.

### Application API

* `POST /api/retreats/apply`
* Server-side validation using Zod
* Honeypot spam protection
* Optional Cloudflare Turnstile verification
* Automatic application reference generation (`FBK-26-XXXXXX`)

### Database

Supports two operating modes:

* Preview/demo mode without Supabase
* Production mode using Supabase Postgres via the Service Role Key

Included assets:

* `supabase/migrations/20260725_retreat_platform.sql`
* `.env.example`

Content defaults for the first event live in `src/lib/retreats/kodaikanal-2026.ts` until full CMS-driven configuration is enabled.

### Security & privacy (product requirements)

Industry-standard practices include server-side validation, Turnstile, Supabase Row Level Security, secure admin authentication, private file storage, consent management, and audit logging. Applicant personal information is not shared with analytics platforms.

### Operational privacy

The public website will not display internal financial projections, operational costs, resort negotiations, facilitator commercial terms, honorarium information, internal review notes, applicant scoring, or profitability models.

---

# Deferred to Future Releases

The following capabilities are intentionally excluded from the MVP:

* Admin dashboard interface
* Online payment gateway integration
* Automated payment reconciliation
* Cloudflare Turnstile production configuration
* Participant portal
* Automated communications
* Retreat operations dashboard
* WhatsApp automation
* Digital waivers
* Multi-retreat management UI
* Founder membership accounts

These will be developed on top of the existing platform without requiring architectural changes.

---

# Deployment Checklist

Before opening applications:

1. Create the Supabase project.
2. Run the retreat platform migration.
3. Configure all production environment variables from `.env.example`.
4. Enable `facilitatorPublic = true` only after receiving Anjaan's written approval to publish his profile.
5. Verify application submission, email delivery, database writes, and structured data before launch.

---

# Next Phase

The next major milestone is the **Founder-Being Admin Console** (operational home—not a generic admin panel).

**Design source of truth:** [ADMIN_DASHBOARD_DESIGN_PRD.md](./ADMIN_DASHBOARD_DESIGN_PRD.md)  
**Institution OS roadmap:** [INSTITUTION_OS_PHASE2.md](./INSTITUTION_OS_PHASE2.md)  
**Shell route (noindex):** `/admin`

Capabilities on the existing schema:

* Application review and selection  
* Founder communication history  
* Deposit and balance tracking  
* Refund management  
* Operational reporting  
* Retreat configuration  
* Capacity management  
* Audit logs  

No database redesign should be required, as the current MVP architecture has been designed to support these future capabilities.

---

# Related Implementation Paths

| Concern | Location |
| ------- | -------- |
| Public retreat page | `src/app/retreats/kodaikanal-full-moon-2026/` |
| Application form UI | `src/components/retreat/` |
| Event content config | `src/lib/retreats/kodaikanal-2026.ts` |
| Apply API | `src/app/api/retreats/apply/route.ts` |
| Database migration | `supabase/migrations/20260725_retreat_platform.sql` |
| Full event PRD | `docs/Founder_Being_Kodaikanal_Retreat_Signup_PRD.md` |

This document is product handoff scope. Engineering detail and acceptance criteria remain in the Kodaikanal implementation PRD.
