# Founder-Being docs

Index of project documentation and the rule for keeping it current.

---

## Documentation sync

**Rule:** When you change code, config, or assets that a markdown file already describes, **update that markdown in the same change** (same PR / commit set). Do not leave docs stale.

### When this applies

1. A file under `docs/` (or a doc linked from this index) covers the topic you are changing.
2. Your change affects behaviour, placement, filenames, sizes, APIs, or processes described in that doc.
3. If no related `.md` exists, you are not required to create one unless the user asks — but if you do create one, add it to the map below.

### How to comply

1. Check this index (or `docs/*.md`) for a matching topic.
2. Edit the related doc so it matches the implementation.
3. Set or refresh a **Last verified** / date line when the doc has one.
4. Mention the doc update in the commit message when non-trivial.

### Topic → doc map

| Topic | Doc | Watch these paths (non-exhaustive) |
|-------|-----|-------------------------------------|
| Logos, monograms, favicons, brand assets | [LOGO_PLACEMENT.md](./LOGO_PLACEMENT.md) | `src/components/Logo.tsx`, `Header.tsx`, `Hero.tsx`, `Footer.tsx`, `src/app/not-found.tsx`, `src/app/privacy/**`, `src/app/terms/**`, `src/app/opengraph-image.tsx`, `src/components/JsonLd.tsx`, `src/app/layout.tsx` (icons), `public/brand/**`, `public/icons/**`, `public/favicon*`, `public/icon*`, `public/apple-touch-icon.png`, `public/site.webmanifest`, `src/app/icon.png`, `src/app/apple-icon.png` |
| Retreat Platform (product handoff) | [RETREAT_PLATFORM_MVP.md](./RETREAT_PLATFORM_MVP.md) | `src/app/retreats/**`, `src/components/retreat/**`, `src/lib/retreats/**`, `src/app/api/retreats/**`, `supabase/migrations/**` |
| Kodaikanal retreat implementation PRD | [Founder_Being_Kodaikanal_Retreat_Signup_PRD.md](./Founder_Being_Kodaikanal_Retreat_Signup_PRD.md) | Same as retreat platform + event content in `src/lib/retreats/kodaikanal-2026.ts` |
| Admin Dashboard (UI/UX design PRD) | [ADMIN_DASHBOARD_DESIGN_PRD.md](./ADMIN_DASHBOARD_DESIGN_PRD.md) | `src/app/admin/**`, `src/components/admin/**`, `src/lib/admin/**`, `src/app/admin/admin.css` |
| Identity & Access (Team & Access) | [IAM_TEAM_ACCESS_PRD.md](./IAM_TEAM_ACCESS_PRD.md) | `src/lib/iam/**`, `src/app/admin/team/**`, `src/app/access/**`, `src/app/api/iam/**`, `supabase/migrations/*iam*` |
| IAM production access control | [IAM_PRODUCTION_ACCESS_CONTROL.md](./IAM_PRODUCTION_ACCESS_CONTROL.md) | `src/middleware.ts`, `src/lib/iam/authz.ts`, `src/app/admin/login/**`, `src/app/admin/auth/**` |
| Upcoming Gatherings | [GATHERINGS.md](./GATHERINGS.md) | Legacy — see Events Domain |
| Events Domain (unified) | [EVENTS_DOMAIN.md](./EVENTS_DOMAIN.md) | `src/lib/events/**`, `src/app/events/**`, `src/components/events/**`, `src/app/api/events/**` |
| Typography system | [TYPOGRAPHY.md](./TYPOGRAPHY.md) | `src/app/globals.css` |
| Institution OS (Phase 2) | [INSTITUTION_OS_PHASE2.md](./INSTITUTION_OS_PHASE2.md) | Future modules: People CRM, orgs, timeline, workflows — post security gate |
| Institutional login & workspaces | [INSTITUTIONAL_LOGIN_WORKSPACES.md](./INSTITUTIONAL_LOGIN_WORKSPACES.md) | `src/app/login/**`, `src/app/founder/**`, `src/lib/iam/workspaces.ts`, `src/middleware.ts` |
| **OS v0.2 Secure People Foundation** | [OS_V0_2_SECURE_PEOPLE_FOUNDATION.md](./OS_V0_2_SECURE_PEOPLE_FOUNDATION.md) | Next milestone: security gate + Person graph + timeline — before other Phase 2 |
| Hash → routes migration | [HASH_TO_ROUTES_MIGRATION.md](./HASH_TO_ROUTES_MIGRATION.md) | Public nav routes, legacy hash map, SEO |

*Add a row whenever a new topic-specific doc is created under `docs/`.*

---

## Other project docs

| Doc | Purpose |
|-----|---------|
| [../README.md](../README.md) | Project overview, stack, run/deploy |
| [AGENTS.md](../AGENTS.md) | Agent / AI coding rules for this repo |
| [RETREAT_PLATFORM_MVP.md](./RETREAT_PLATFORM_MVP.md) | Retreat Platform product handoff (vision, MVP, checklist, next phase) |
| [Founder_Being_Kodaikanal_Retreat_Signup_PRD.md](./Founder_Being_Kodaikanal_Retreat_Signup_PRD.md) | Full implementation PRD for Kodaikanal Full Moon Retreat (Aug 2026) |
| [ADMIN_DASHBOARD_DESIGN_PRD.md](./ADMIN_DASHBOARD_DESIGN_PRD.md) | Admin Dashboard design PRD — Calm Operations UI/UX |
| [IAM_TEAM_ACCESS_PRD.md](./IAM_TEAM_ACCESS_PRD.md) | IAM / Team & Access — RBAC, Super Admin, invites |
| [IAM_PRODUCTION_ACCESS_CONTROL.md](./IAM_PRODUCTION_ACCESS_CONTROL.md) | Phase 1 authn/authz gates — not prod-secure until checklist passes |
| [GATHERINGS.md](./GATHERINGS.md) | Upcoming Gatherings catalogue + CMS interest tags |
| [TYPOGRAPHY.md](./TYPOGRAPHY.md) | Typography scale, colour tokens, rhythm, content types |
| [INSTITUTION_OS_PHASE2.md](./INSTITUTION_OS_PHASE2.md) | Phase 2 Institutional Readiness — Institution OS architecture |
| [OS_V0_2_SECURE_PEOPLE_FOUNDATION.md](./OS_V0_2_SECURE_PEOPLE_FOUNDATION.md) | **Next milestone** — security gate + canonical Person graph |

---

## Recommended reading order (new contributors)

1. [OS_V0_2_SECURE_PEOPLE_FOUNDATION.md](./OS_V0_2_SECURE_PEOPLE_FOUNDATION.md) — what to build next  
2. [IAM_PRODUCTION_ACCESS_CONTROL.md](./IAM_PRODUCTION_ACCESS_CONTROL.md) — security gate  
3. [INSTITUTION_OS_PHASE2.md](./INSTITUTION_OS_PHASE2.md) — long-term OS map  
4. [EVENTS_DOMAIN.md](./EVENTS_DOMAIN.md) — unified events  
5. [INSTITUTIONAL_LOGIN_WORKSPACES.md](./INSTITUTIONAL_LOGIN_WORKSPACES.md) — Sign In & dashboards  

---

## Creating a new topic doc

1. Add `docs/<TOPIC>.md` with clear ownership of a domain (e.g. leads, events, SEO).
2. Register it in the **Topic → doc map** above with the paths that should trigger updates.
3. Reference it from `README.md` if it is user-facing or frequently needed.
