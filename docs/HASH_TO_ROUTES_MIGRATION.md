# Hash → Real Routes Migration Report

**Date:** 2026-07-25  
**Status:** Complete · public IA stable  
**Last verified:** 2026-07-25  

---

## Canonical public routes (primary model)

All new public CTAs, documentation, emails, event links, and CMS content must use:

```text
/about
/mission
/impact
/events
/patrons
/community
/contact
```

Plus programme and utility routes as needed:

```text
/
/events/[slug]
/events/interest?event={slug}
/retreats/...
/login
/access
/privacy
/terms
```

### Cleanup rule (from this point forward)

**Do not introduce new `/#...` links**, even for convenience.

---

## Mapping (legacy only)

| Old URL | New URL | Redirect behaviour |
| ------- | ------- | ------------------ |
| `/#about` | `/about` | Client `router.replace` via `LegacyHashRedirect` |
| `/#vision` | `/mission` | Client replace |
| `/#mission` | `/mission` | Client replace |
| `/#impact` | `/impact` | Client replace |
| `/#community` | `/community` | Client replace |
| `/#events` | `/events` | Client replace |
| `/#patron` | `/patrons` | Client replace |
| `/#patrons` | `/patrons` | Client replace |
| `/#contact` | `/contact` | Client replace |
| `/#join` | `/contact` | Client replace |
| `/#changed` | `/about` | Client replace |
| `/#top` | `/` | Client replace |

**Note:** URL fragments are not sent to the server; migration is browser-side on homepage load. Unknown hashes are ignored (no error).

---

## Navigation updated

| Surface | Status |
| ------- | ------ |
| Desktop header | Real routes + `pathname` active state |
| Mobile menu | Real routes + Sign In |
| Footer navigate | Real routes + Sign In |
| Hero CTAs | `/patrons`, `/about`, `/events`, `/mission` |
| Homepage pathways | All real routes |
| Patron CTA | `/contact` |
| Sitemap | All new routes; no hash URLs |
| Metadata | Unique title/description/canonical/OG per route |

---

## Routes added

```text
/
/about
/mission
/impact
/events
/patrons
/community
/contact
/login
/privacy
/terms
```

Dedicated programmes unchanged: `/retreats/...`, `/events/...` detail, `/access`, `/login`.

---

## SEO

* One H1 per page  
* Canonical per route (`alternates.canonical`)  
* Open Graph title, description, URL  
* `sitemap.xml` lists all public section routes + catalogue events  
* Homepage is concise (preview + pathways) — not a long SPA  

---

## Allowed in-page anchors (not IA hashes)

These are **not** section SPA routes and may remain:

| Pattern | Purpose |
| ------- | ------- |
| `href="#main-content"` | Accessibility skip link |
| Retreat page `#apply`, `#programme` | Same-page jumps on long programme content |

They must never replace primary discovery routes such as `/events` or `/about`.

---

## Acceptance check (code review · 2026-07-25)

| Test | Result |
| ---- | ------ |
| Primary nav has no `/#...` | ✅ `navLinks` real routes only |
| Footer has no `/#...` | ✅ |
| Hero / pathways real routes | ✅ |
| Direct load routes exist | ✅ `/about` … `/contact` pages |
| Refresh works | ✅ Static/SSR App Router pages |
| Mobile menu uses `navLinks` | ✅ shared `Header` |
| Event CTA prefill | ✅ `/events/interest?event=` |
| Canonical tags | ✅ per public section + events |
| Sitemap entries | ✅ `src/app/sitemap.ts` |
| Legacy hash redirects | ✅ `LegacyHashRedirect` + `legacyHashRoutes` |
| Invalid routes | ✅ app `not-found` |
| Repo `href="/#..."` in product CTAs | ✅ none |
| Repo `href="#..."` (IA) | ✅ none (skip + same-page only) |

**Live production smoke** (operator): direct load, refresh, back/forward, mobile menu, footer, one old hash URL — confirm on `foundrbeing.com` after next deploy.

---

## Legacy hash handling policy

Keeping legacy redirects **temporarily** is correct.

Remove `LegacyHashRedirect` and `legacyHashRoutes` **only after** analytics confirm that routes such as:

```text
/#events
/#about
/#mission
/#patrons
```

no longer receive meaningful traffic.

Until then they are **compatibility redirects only** — not part of the primary navigation model.

---

## Implementation map

| Piece | Path |
| ----- | ---- |
| Nav + legacy map | `src/lib/site.ts` |
| Hash client redirect | `src/components/LegacyHashRedirect.tsx` |
| Header / Footer | `src/components/Header.tsx`, `Footer.tsx` |
| Sitemap | `src/app/sitemap.ts` |
| Section pages | `src/app/{about,mission,impact,events,patrons,community,contact}/` |

---

## Bottom line

The public information architecture is **stable**. Build on real routes; do not return to a single-page hash structure.
