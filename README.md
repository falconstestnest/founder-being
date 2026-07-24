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
- [Retreat platform MVP](docs/RETREAT_PLATFORM_MVP.md) — product scope for application-based retreats
- [Kodaikanal retreat PRD](docs/Founder_Being_Kodaikanal_Retreat_Signup_PRD.md) — full implementation PRD

## Retreats

| Event | Public route |
|-------|----------------|
| Kodaikanal Full Moon Retreat (26–31 Aug 2026) | [`/retreats/kodaikanal-full-moon-2026`](https://www.foundrbeing.com/retreats/kodaikanal-full-moon-2026) |

Application-first only (no online payment in MVP). Set Supabase env vars from `.env.example` and run `supabase/migrations/20260725_retreat_platform.sql` before production applications.

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
