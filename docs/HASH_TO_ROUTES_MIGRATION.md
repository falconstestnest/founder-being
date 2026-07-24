# Hash → Real Routes Migration Report

**Date:** 2026-07-25  
**Status:** Complete for primary navigation  

---

## Mapping

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
/events          (existing hub, refined metadata)
/patrons
/community
/contact
/login           (existing)
/privacy         (existing)
/terms           (existing)
```

Dedicated programmes unchanged: `/retreats/...`, `/events/...` detail, `/access`, `/login`.

---

## SEO

* One H1 per page  
* Canonical per route  
* Open Graph title, description, URL  
* `sitemap.xml` lists all public section routes  
* Homepage no longer duplicates full section pages (previews + pathways only)

---

## Test checklist

| Test | Status |
| ---- | ------ |
| Primary nav has no `/#...` | Pass (code review) |
| `/about`, `/mission`, `/impact`, `/events`, `/patrons` direct load | Pass (build routes exist) |
| Refresh works on each route | Pass (static/SSR pages) |
| Legacy hash → route (`/#events`) | Pass (`LegacyHashRedirect`) |
| Event interest forms keep event metadata | Pass (`/events/interest?event=`) |
| Unique metadata | Pass (per-page `metadata` exports) |
| Mobile nav on every route | Pass (shared `Header`) |
| Design system consistency | Pass (existing components + tokens) |

Automated e2e for hash migration can be added later; keep `LegacyHashRedirect` until analytics show negligible hash traffic.

---

## Do not remove yet

* `LegacyHashRedirect` on homepage  
* `legacyHashRoutes` map in `src/lib/site.ts`  

Remove only after traffic data confirms hash links are obsolete.
