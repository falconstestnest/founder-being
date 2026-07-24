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

Full path watchlists live in `docs/README.md`.

## Retreat Platform notes

- Product handoff: `docs/RETREAT_PLATFORM_MVP.md` (keep language product-facing, not “what we shipped today”).
- Public event page: `/retreats/kodaikanal-full-moon-2026` (separate from the main homepage).
- Application-first: no checkout or Buy Now in MVP.
- Content defaults: `src/lib/retreats/kodaikanal-2026.ts`.
- Schema: `supabase/migrations/`.
- Never publish internal costs, honoraria, or applicant scoring on the public site.
- Admin UI follows `docs/ADMIN_DASHBOARD_DESIGN_PRD.md` (Calm Operations). Shell at `/admin` must stay noindex; auth required before production.
- IAM is **Team & Access** (`docs/IAM_TEAM_ACCESS_PRD.md`), not a generic Users page. Super Admin: `jimmymanalel@gmail.com` — protected, not removable via UI.
<!-- END:docs-sync-rules -->
