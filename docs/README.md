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
| Retreat platform product scope (MVP) | [RETREAT_PLATFORM_MVP.md](./RETREAT_PLATFORM_MVP.md) | `src/app/retreats/**`, `src/components/retreat/**`, `src/lib/retreats/**`, `src/app/api/retreats/**`, `supabase/migrations/**` |
| Kodaikanal retreat full PRD | [Founder_Being_Kodaikanal_Retreat_Signup_PRD.md](./Founder_Being_Kodaikanal_Retreat_Signup_PRD.md) | Same as retreat platform + event content in `src/lib/retreats/kodaikanal-2026.ts` |

*Add a row whenever a new topic-specific doc is created under `docs/`.*

---

## Other project docs

| Doc | Purpose |
|-----|---------|
| [../README.md](../README.md) | Project overview, stack, run/deploy |
| [AGENTS.md](../AGENTS.md) | Agent / AI coding rules for this repo |
| [RETREAT_PLATFORM_MVP.md](./RETREAT_PLATFORM_MVP.md) | Product scope for retreat applications |
| [Founder_Being_Kodaikanal_Retreat_Signup_PRD.md](./Founder_Being_Kodaikanal_Retreat_Signup_PRD.md) | Implementation-ready PRD for Aug 2026 retreat |

---

## Creating a new topic doc

1. Add `docs/<TOPIC>.md` with clear ownership of a domain (e.g. leads, events, SEO).
2. Register it in the **Topic → doc map** above with the paths that should trigger updates.
3. Reference it from `README.md` if it is user-facing or frequently needed.
