# Founder-Being

Institutional one-page website for **Founder-Being** — a founder wellbeing and conscious leadership initiative.

**Tagline:** Building Healthier Founders. Building Better Companies.

**Canonical URL:** [https://www.founderbeing.org](https://www.founderbeing.org)

## Design

Quiet, premium, editorial. Apple × Aesop × Headspace — not a startup landing page.

| Token | Value |
|-------|--------|
| Black | `#0B0B0B` |
| White | `#F8F8F8` |
| Gold accent | `#FFAB33` |
| Primary type | Inter |
| Editorial type | Cormorant Garamond |
| Numbers / labels | IBM Plex Mono |
| Max width | 1280px |
| Content width | 760px |

Motion: fade only. No gradients, parallax, or animated counters.

## Docs

- [Docs index & sync rule](docs/README.md) — keep topic markdown updated when related code changes
- [Logo placement](docs/LOGO_PLACEMENT.md) — lockups, monograms, favicons, and where they appear
- [Retreat Platform](docs/RETREAT_PLATFORM_MVP.md) — product handoff (scope, privacy, checklist, next phase)
- [Kodaikanal retreat PRD](docs/Founder_Being_Kodaikanal_Retreat_Signup_PRD.md) — full implementation requirements
- [Admin Dashboard design PRD](docs/ADMIN_DASHBOARD_DESIGN_PRD.md) — Calm Operations UI/UX
- [Team & Access (IAM)](docs/IAM_TEAM_ACCESS_PRD.md) — roles, Super Admin, invite/approve
- [Institution OS Phase 2](docs/INSTITUTION_OS_PHASE2.md) — People CRM, orgs, timeline, workflows (post security gate)
- [Typography](docs/TYPOGRAPHY.md) — type scale and colour tokens

## Retreat Platform

Application-based residential retreats, separate from the homepage.

| Event | Public route |
|-------|----------------|
| Kodaikanal Full Moon Retreat (26–31 Aug 2026) | [`/retreats/kodaikanal-full-moon-2026`](https://www.foundrbeing.com/retreats/kodaikanal-full-moon-2026) |

See the [Retreat Platform handoff](docs/RETREAT_PLATFORM_MVP.md) for principles, MVP boundaries, deployment checklist, and Admin Console roadmap.

## Operations & IAM

| Surface | Route |
|---------|--------|
| Sign in | `/admin/login` |
| Operations shell | `/admin` (auth required) |
| Team & Access (IAM) | `/admin/team` |
| Request access | `/access` (request only — not registration) |

**Not production-secure until** the [production access-control gate](docs/IAM_PRODUCTION_ACCESS_CONTROL.md) passes (session + profile + role + permission on every action).

Super Administrator is bootstrapped in the database only (Jimmy James · `jimmymanalel@gmail.com` · protected). Email match never grants privileges.

```bash
# Required for /admin
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=
SUPABASE_SERVICE_ROLE_KEY=
```

Run IAM migrations under `supabase/migrations/*iam*`.

## Stack

- Next.js App Router (SSR / static where possible)
- TypeScript
- Tailwind CSS v4
- Vercel deployment

## Develop

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

```bash
npm run build
npm start
```

## Project structure

```
src/
  app/           # routes, SEO, API
  components/    # page sections
  lib/           # site config + content data
```

Join form posts to `POST /api/join` (validated; logs payload until a CRM is wired).

## SEO

- Meta title / description per brand spec
- Canonical, Open Graph, Twitter cards
- `sitemap.xml`, `robots.txt`
- JSON-LD: Organization, WebSite, Event, BreadcrumbList
- Dynamic OG image at `/opengraph-image`

## Deploy

Connected to GitHub + Vercel. Push to `main` for production.

```bash
vercel --prod
```

## License

Private — all rights reserved, Founder-Being.
