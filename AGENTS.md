<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

<!-- BEGIN:docs-sync-rules -->
# Documentation sync (required)

When changing code, config, or assets that an existing markdown file already describes, **update that markdown in the same change**. Do not leave topic docs stale.

## Process

1. Before finishing a change, open `docs/README.md` and check the **Topic → doc map**.
2. If any listed path or topic matches your work, edit the linked `docs/*.md` so it matches the new behaviour (sizes, filenames, placement, APIs, etc.).
3. Refresh **Last verified** (or equivalent) dates when present.
4. If you create a new topic-specific doc under `docs/`, register it in `docs/README.md`’s map with the paths that should trigger future updates.
5. You do **not** need to invent new docs unless the user asks — only keep existing related ones current.

## Current topic docs

| Topic | Doc |
|-------|-----|
| Logos / brand assets / favicons | `docs/LOGO_PLACEMENT.md` |
| Retreat Platform product handoff | `docs/RETREAT_PLATFORM_MVP.md` |
| Kodaikanal Full Moon Retreat PRD | `docs/Founder_Being_Kodaikanal_Retreat_Signup_PRD.md` |
| Admin Dashboard design PRD | `docs/ADMIN_DASHBOARD_DESIGN_PRD.md` |
| IAM Team & Access | `docs/IAM_TEAM_ACCESS_PRD.md` |
| Events Domain | `docs/EVENTS_DOMAIN.md` |
| Events Operations Foundation | `docs/EVENTS_OPERATIONS_FOUNDATION.md` |
| Institution OS Phase 2 | `docs/INSTITUTION_OS_PHASE2.md` |
| OS v0.2 Secure People Foundation | `docs/OS_V0_2_SECURE_PEOPLE_FOUNDATION.md` |

Full path watchlists live in `docs/README.md`.

## Events & programme notes

- **Single Events domain** — no new retreat or gathering data models. Admin primary surface: `/admin/events`.
- Public hub: `/events`. Catalogue: `src/lib/events/catalog.ts`. Ops shell: participation, lifecycle, workflow tabs.
- Public event page: `/retreats/kodaikanal-full-moon-2026` (legacy path; also under Events).
- Application-first: no checkout or Buy Now on retreats in MVP.
- Content defaults: `src/lib/retreats/kodaikanal-2026.ts` + `src/lib/events/*`.
- Schema: `supabase/migrations/` (includes `event_participation`, lifecycle audit).
- Never publish internal costs, honoraria, or applicant scoring on the public site.
- Counts are **derived** from participation records — never primary source of truth.
- Admin UI follows `docs/ADMIN_DASHBOARD_DESIGN_PRD.md` (Calm Operations). Shell at `/admin` must stay noindex; auth required before production.
- IAM is **Team & Access** (`docs/IAM_TEAM_ACCESS_PRD.md`), not a generic Users page. Super Admin: `jimmymanalel@gmail.com` — protected, bootstrap via DB only.
- **Never** grant access by email match. Use `requireAuthz(permission)` on every admin API. See `docs/IAM_PRODUCTION_ACCESS_CONTROL.md`.
- Local `.data/` IAM is disabled in production. `/admin` is middleware-protected.
- Post-auth hub is always `/workspace` (not a role path). Resolver is **routing only** — every workspace/API re-checks auth. See `docs/INSTITUTIONAL_LOGIN_WORKSPACES.md`.
- Relationship labels never grant CMS access. MFA hard-block when `REQUIRE_WORKSPACE_MFA=1`.
- Long-term product is an **Institution OS** (`docs/INSTITUTION_OS_PHASE2.md`): one Person graph, append-only timeline, IAM ≠ CRM. Do not invent parallel contact silos per programme.
- **Next milestone only:** `docs/OS_V0_2_SECURE_PEOPLE_FOUNDATION.md` — finish security gate + Person graph before communications, documents, finance, automation, or AI.
- Every Phase 2 feature must answer: (1) canonical owner entity? (2) timeline event? (3) required permission?
<!-- END:docs-sync-rules -->
