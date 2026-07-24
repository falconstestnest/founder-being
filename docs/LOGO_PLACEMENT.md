# Founder-Being — Brand Asset Placement

Guide to correct logo use on the Founder-Being website.  
**Keep this file in sync** with any brand/logo code or asset changes (see [Documentation sync](./README.md#documentation-sync)).

| | |
|---|---|
| **Live site** | https://www.foundrbeing.com |
| **Component** | `src/components/Logo.tsx` |
| **Project assets** | `public/brand/` |
| **Source pack** | `~/Downloads/3. Founder-Being/founder being/` |
| **Last verified** | 2026-07-25 |

---

## Primary brand system

Three asset types:

| Type | Role | When to use |
|------|------|-------------|
| **Monogram** | Brand mark only | Limited space, favicons, app icons |
| **Wordmark** | `FOUNDER-BEING` text | Editorial / reserved (not primary UI) |
| **Primary lockup** | Monogram + wordmark as one export | Default wherever space allows |

**Default expression on the site:** white primary lockup on dark backgrounds.  
**Gold monogram:** icons, favicons, and subtle accents only — not the main UI lockup.

> Never reconstruct the logo by placing monogram and wordmark as separate UI elements. Always use a single exported lockup file so spacing and proportions stay correct.

---

## Current website usage (implemented)

| Location | Variant | File | Height | Source file |
|----------|---------|------|-------:|-------------|
| Header · desktop (`sm+`) | `lockup-white` | `lockup-white.png` | 44 px | `src/components/Header.tsx` |
| Header · mobile (`<sm`) | `monogram-white` | `monogram-white.png` | 32 px | `src/components/Header.tsx` |
| Hero | `lockup-white` | `lockup-white.png` | 130 px | `src/components/Hero.tsx` |
| Footer | `lockup-white` | `lockup-white.png` | 52 px | `src/components/Footer.tsx` |
| Privacy | `lockup-white` | `lockup-white.png` | 44 px | `src/app/privacy/page.tsx` |
| Terms | `lockup-white` | `lockup-white.png` | 44 px | `src/app/terms/page.tsx` |
| 404 | `lockup-white` | `lockup-white.png` | 96 px | `src/app/not-found.tsx` |
| Loading (optional) | monogram white | — | — | Not implemented |

Breakpoint: mobile monogram uses Tailwind `sm` (640px).

---

## Logo component

**Path:** `src/components/Logo.tsx`  
**Default variant:** `lockup-white`  
**Default height:** `44`

### Supported variants

| Variant | Asset path | Typical use |
|---------|------------|-------------|
| `lockup-white` | `/brand/lockup-white.png` | Dark UI (default) |
| `lockup-gold` | `/brand/lockup-gold.png` | Campaign / special only |
| `lockup-black` | `/brand/lockup-black.png` | Light backgrounds |
| `monogram-white` | `/brand/monogram-white.png` | Mobile header, tight space |
| `monogram-gold` | `/brand/monogram-gold.png` | Icons / accents |
| `monogram-black` | `/brand/monogram-black.png` | Light UI surfaces |
| `wordmark-white` | `/brand/wordmark-white.png` | Reserved |
| `wordmark-gold` | `/brand/wordmark-gold.png` | Reserved |
| `wordmark-black` | `/brand/wordmark-black.png` | Reserved |

Lockups are **single exported images** (trimmed web versions). Intrinsic sizes in `Logo.tsx` must match the PNGs after any asset regenerate.

---

## Browser & app icons

Gold monogram only (never full lockup).

| Location | Path | Notes |
|----------|------|--------|
| Favicon 16×16 | `/favicon-16x16.png` | From gold monogram |
| Favicon 32×32 | `/favicon-32x32.png` | From gold monogram |
| Favicon fallback | `/favicon.png` | 32 px |
| App Router icon | `src/app/icon.png` → `/icon.png` | |
| Apple touch | `src/app/apple-icon.png`, `/apple-touch-icon.png` | 180 px |
| Android / PWA | `/icon-192.png`, `/icon-512.png` | |
| Manifest | `/site.webmanifest` | References 192 / 512 |
| Icon masters | `public/icons/` | Source derivatives |

Metadata icons are declared in `src/app/layout.tsx`.

---

## SEO & social

| Location | Asset | Code |
|----------|--------|------|
| Open Graph image | White lockup + tagline | `src/app/opengraph-image.tsx` |
| Twitter / X card | Same as OG (via metadata) | `src/app/layout.tsx` |
| JSON-LD `Organization.logo` | `/brand/lockup-white.png` | `src/components/JsonLd.tsx` |
| JSON-LD `Organization.image` | `/brand/monogram-gold.png` | `src/components/JsonLd.tsx` |

---

## Files in `public/brand/`

### Active (used by `Logo` or SEO)

| File | Role |
|------|------|
| `lockup-white.png` | Primary UI lockup (web-optimized) |
| `lockup-gold.png` | Campaign lockup |
| `lockup-black.png` | Light-background lockup |
| `monogram-white.png` | White mark |
| `monogram-gold.png` | Gold mark (icons) |
| `monogram-black.png` | Black mark |
| `wordmark-white.png` | Wordmark |
| `wordmark-gold.png` | Wordmark |
| `wordmark-black.png` | Wordmark |

### Archive / legacy (do not use in new UI)

| File | Notes |
|------|--------|
| `lockup-*-full.png` | Untrimmed source masters |
| `logo-white.png`, `logo-gold.png`, `logo-black.png` | Legacy exports |
| `logo-white-stacked.png`, `logo-*-640.png` | Intermediate / legacy |
| `monogram-*-128.png`, `monogram-*-512.png` | Size helpers |
| `wordmark-*-600.png` | Size helpers |

---

## Recommended display sizes

| Usage | Height |
|-------|-------:|
| Header (desktop) | **40–48 px** (implemented **44**) |
| Header (mobile) | **32 px** |
| Hero | **120–140 px** (implemented **130**) |
| Footer | **48–56 px** (implemented **52**) |
| 404 | **~96 px** |
| Favicon | **16 / 32 px** |
| App icon | **192 / 512 px** |

---

## Rules

### Do

* Keep original proportions (height-driven; width from aspect ratio).
* Prefer **white lockup** on `#0B0B0B` and other dark surfaces.
* Use **black lockup** only on light backgrounds.
* Use **gold monogram** for favicons, app icons, and selected accents.
* Leave clear space around the mark (at least the small detached circle’s diameter).

### Do not

* Build lockups from separate monogram + wordmark nodes.
* Stretch, crop, rotate, or recolor assets in CSS.
* Add shadows, gradients, strokes, or effects.
* Put gold lockup on the main dark site UI unless a campaign requires it.
* Place logos on busy photography without contrast.

---

## Brand principle

The Founder-Being identity should feel understated, refined, and timeless. The **white primary lockup** is the default brand expression on the website; the **gold monogram** is reserved for small-format icons and browser assets. That restraint supports a calm, premium, institutional presence.
