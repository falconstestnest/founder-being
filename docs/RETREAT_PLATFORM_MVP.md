# Founder-Being Retreat Platform (MVP)

**Status:** Product scope (website PRD section)  
**Last verified:** 2026-07-25  

The Founder-Being website includes a dedicated retreat application platform designed to support curated, application-based residential experiences. The first implementation supports the **Kodaikanal Full Moon Retreat (26–31 August 2026)** through a secure, manual approval workflow.

This document is **product scope**. Detailed implementation requirements live in [Founder_Being_Kodaikanal_Retreat_Signup_PRD.md](./Founder_Being_Kodaikanal_Retreat_Signup_PRD.md).

**Public route (this event only):**  
`/retreats/kodaikanal-full-moon-2026`

---

## Core product principles

* **Application-first experience** — founders apply to attend rather than purchasing a ticket immediately.
* **Curated cohort selection** — every application is reviewed personally before an invitation is extended.
* **Private payment workflow** — payments are collected only after approval and direct communication.
* **Founder privacy by design** — personal information is securely stored and accessible only to authorized administrators.
* **Operational flexibility** — event confirmation, pricing, deadlines, and capacity remain configurable without requiring code changes.

---

## MVP features

### Public experience

The public retreat page includes:

* Retreat overview  
* Day-by-day programme  
* Facilitator profile (published only after written confirmation)  
* What's included  
* Pricing  
* Application process  
* Frequently Asked Questions  
* Multi-step founder application form  

Primary CTA throughout: **Apply to Attend**  

No online checkout or “Buy Now” functionality in the initial release.

### Founder applications

Applications are securely stored in **Supabase** using Row Level Security (RLS) so applicant information is accessible only to authorised Founder-Being administrators.

Application workflow:

Submission → Review → Shortlisting → Selection → Personal contact → Deposit collection → Final payment → Retreat confirmation

### Selection process

Applications are reviewed manually by the Founder-Being team.

Selection considers: founder fit, intent, willingness to participate, cohort diversity, and community contribution.

Selection is **not** based solely on company size, funding, or public profile.

### Payment workflow (MVP)

* Selected founders contacted personally by **3 August 2026**
* Payment instructions shared privately via WhatsApp or email
* Initial reservation deposit: **₹15,000**
* Remaining balance payable after the retreat is officially confirmed
* No online payment gateway in the first release

### Capacity management

* Maximum participants: **15 founders**
* Minimum confirmed cohort: **12 paid founders**
* Retreat proceeds only after the minimum viable cohort has been achieved

### Administration dashboard

Internal (not public) for: application review, status management, founder communication, deposit tracking, balance collection, refund management, operational reporting, and audit history.

### Security & privacy

Server-side validation, Cloudflare Turnstile, Supabase RLS, secure admin authentication, encrypted storage, private files, consent management, and audit logging. No applicant personal information is shared with analytics platforms.

### SEO & analytics

SEO landing pages, Schema.org Event, Open Graph, consent-based GA4, sitemap, performance / Core Web Vitals.

### Operational privacy (never public)

Internal financial projections, operational costs, resort negotiations, facilitator commercial terms, honorarium, internal review notes, applicant scoring, and profitability models remain internal.

### Future enhancements

Online payments, automated reconciliation, participant portal, WhatsApp automation, digital waivers, retreat CRM, room allocation, multi-retreat management, founder membership accounts.

---

## Related files

| Concern | Path |
|---------|------|
| Event content config | `src/lib/retreats/kodaikanal-2026.ts` |
| Public page | `src/app/retreats/kodaikanal-full-moon-2026/` |
| Application API | `src/app/api/retreats/apply/route.ts` |
| Supabase schema | `supabase/migrations/` |
| Full event PRD | `docs/Founder_Being_Kodaikanal_Retreat_Signup_PRD.md` |

---

This approach keeps the public website clean and founder-centric while providing a robust operational backend for Founder-Being retreat programmes.
