# Founder-Being — Brand Asset Placement

*A guide to the correct use of Founder-Being logos across the website.*

**Source Assets**

`~/Downloads/3. Founder-Being/founder being/`

**Project Assets**

`/public/brand/`

---

# Primary Brand System

Founder-Being has three primary brand assets:

* **Monogram** (brand mark)
* **Wordmark** ("FOUNDER-BEING")
* **Primary Lockup** (monogram + wordmark)

The **primary lockup** should be used wherever space permits to strengthen brand recognition.

The **monogram alone** should only be used where space is limited or where platform conventions require an icon.

---

# Website Usage

| Location                      | Recommended Asset                               | Implemented size |
| ----------------------------- | ----------------------------------------------- | ---------------: |
| **Header (Desktop)**          | **Primary Lockup – White** (`lockup-white.png`) |           44 px |
| **Header (Mobile)**           | **Monogram – White** (`monogram-white.png`)     |           32 px |
| **Hero Section**              | **Primary Lockup – White** (large)              |          130 px |
| **Footer**                    | **Primary Lockup – White** (small)              |           52 px |
| **Privacy Policy**            | **Primary Lockup – White**                      |           44 px |
| **Terms & Conditions**        | **Primary Lockup – White**                      |           44 px |
| **404 Page**                  | **Primary Lockup – White**                      |           96 px |
| **Loading Screen (optional)** | **Monogram – White**                            |              — |

> Avoid reconstructing the logo by combining the monogram and wordmark separately in the UI. Always use the exported lockup asset to preserve spacing, alignment, and proportions.

---

# Logo Component

`src/components/Logo.tsx`

Supported variants:

* `lockup-white`
* `lockup-gold`
* `lockup-black`
* `monogram-white`
* `monogram-gold`
* `monogram-black`
* `wordmark-white`
* `wordmark-gold`
* `wordmark-black`

Default variant:

```
lockup-white
```

---

# Browser & App Icons

| Location                | Asset                          |
| ----------------------- | ------------------------------ |
| Favicon (16×16 / 32×32) | `monogram-gold.png`            |
| App Icon                | `icon.png`                     |
| Apple Touch Icon        | `apple-icon.png`               |
| Android Icons           | `icon-192.png`, `icon-512.png` |
| PWA Manifest            | `site.webmanifest`             |

Only the **monogram** should be used for browser and device icons.

---

# SEO & Social

| Location                     | Asset                                                     |
| ---------------------------- | --------------------------------------------------------- |
| Open Graph Image             | White lockup + tagline (`src/app/opengraph-image.tsx`)    |
| Twitter/X Card               | Same as Open Graph                                        |
| JSON-LD Organization `logo`  | `lockup-white.png`                                        |
| JSON-LD Organization `image` | `monogram-gold.png`                                       |

---

# Assets Reserved for Future Use

| Asset                | Purpose                                    |
| -------------------- | ------------------------------------------ |
| `lockup-black.png`   | Light backgrounds                          |
| `lockup-gold.png`    | Campaign / special edition only            |
| `wordmark-black.png` | Editorial layouts                          |
| `wordmark-gold.png`  | Print and presentations                    |
| `monogram-black.png` | Light UI surfaces                          |
| `logo-white.png`     | Legacy export (not recommended for web UI) |
| `logo-gold.png`      | Legacy export                              |
| `logo-black.png`     | Legacy export                              |
| `*-full.png`         | Untrimmed source masters                   |

---

# Logo Rules

### Use

* Always maintain the logo's original proportions.
* Use the **white lockup** on dark backgrounds.
* Use the **black lockup** only on light backgrounds.
* Use the **gold monogram** exclusively for favicons, application icons, and selected brand accents.
* Maintain generous clear space around the logo (minimum equal to the diameter of the small detached circle in the monogram).

### Do Not

* Recreate the logo by positioning the monogram and wordmark independently.
* Stretch, crop, rotate, or recolor the logo.
* Add shadows, gradients, strokes, or effects.
* Use the gold lockup on the website's dark interface unless specifically required for a campaign or special edition.
* Place the logo over busy photography or textured backgrounds without sufficient contrast.

---

# Recommended Display Sizes

| Usage         |           Height |
| ------------- | ---------------: |
| Header        |     **40–48 px** |
| Hero          |   **120–140 px** |
| Footer        |     **48–56 px** |
| Mobile Header |        **32 px** |
| Favicon       |   **16 / 32 px** |
| App Icon      | **192 / 512 px** |

---

**Brand Principle:** The Founder-Being identity should feel understated, refined, and timeless. Throughout the website, the **white primary lockup** should serve as the default expression of the brand, while the **gold monogram** is reserved for small-format icons, browser assets, and subtle brand accents. This restraint reinforces a calm, premium, and institutional visual identity.
