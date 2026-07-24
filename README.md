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

- [Logo placement](docs/LOGO_PLACEMENT.md) — where monograms, wordmarks, and favicons appear

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
