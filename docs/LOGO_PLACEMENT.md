# Founder-Being — Logo Placement

Short map of where brand assets appear on the site.

**Source pack:** `~/Downloads/3. Founder-Being/founder being/`  
**In repo:** `public/brand/` and `public/` (icons)

---

## On-page

| Where | What | Asset(s) |
|-------|------|----------|
| **Header** (all pages with nav) | Mark + wordmark (wordmark hidden on very small screens) | `monogram-white.png`, `wordmark-white.png` |
| **Hero** | Stacked lockup (monogram ~110px + wordmark) | `monogram-white.png`, `wordmark-white.png` |
| **Footer** | Stacked lockup (smaller) | same white lockup |
| **Privacy** | Mark + wordmark | same as header |
| **Terms** | Mark + wordmark | same as header |

Component: `src/components/Logo.tsx`  
Variants: `mark-white`, `mark-gold`, `wordmark-white`, `wordmark-gold`, `lockup-white`, `lockup-gold`

---

## Browser / app chrome

| Where | Asset |
|-------|--------|
| Favicon 16 / 32 | Gold monogram → `/favicon-16x16.png`, `/favicon-32x32.png` |
| App Router icons | `/icon.png`, `/apple-icon.png` (gold monogram) |
| Apple touch | `/apple-touch-icon.png` |
| PWA / manifest | `/icon-192.png`, `/icon-512.png` → `site.webmanifest` |

---

## SEO / social

| Where | Asset |
|-------|--------|
| Open Graph image | Gold monogram + tagline (`src/app/opengraph-image.tsx`) |
| JSON-LD Organization | `logo` → `/brand/logo-white.png`, `image` → `/brand/monogram-gold.png` |

---

## Available but not used in UI (kept for future)

| File | Notes |
|------|--------|
| `logo-gold.png` / `logo-white.png` | Full stacked logos on black field |
| `logo-black.png` | Dark lockup (for light backgrounds) |
| `wordmark-gold.png` / `wordmark-black.png` | Wordmark colour variants |
| `monogram-gold.png` | Used for icons/OG; not in main chrome UI |

---

*Last updated with brand-pack integration.*
