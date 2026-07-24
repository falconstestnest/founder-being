# Typography system

**Status:** Pre-launch refinement  
**Last verified:** 2026-07-25  

Calm, readable, institutional. WCAG AA on `#0B0B0B`.

---

## Colour tokens (semantic)

Prefer semantic names. `text-fb-*` remains as alias.

| Token | Value | Use |
| ----- | ----- | --- |
| `text-primary` | `#F8F8F8` | Headings, high emphasis |
| `text-body` | `#E8E8EC` | Paragraphs, lists, main reading |
| `text-secondary` | `#C4C4CC` | Supporting lines |
| `text-tertiary` / meta | `#A8A8B2` | Labels, captions |
| `text-disabled` | `#6B6B74` | Disabled controls |
| `text-accent` | `#FFAB33` | Gold accents only |
| `text-success` / `warning` / `error` | semantic | Feedback |

---

## Type scale (strict)

| Token | Size | Weight | Use |
| ----- | ---- | ------ | --- |
| `.type-display` | clamp ~40–60px | 500 | Hero headlines |
| `.type-h1` | clamp ~32–44px | 500 | Major pages |
| `.type-h2` | clamp ~28–36px | 500 | Sections |
| `.type-h3` | 24px | 500 | Cards |
| `.type-h4` | 20px | 500 | Subsections |
| `.type-body-lg` | 18px | 400 | Long-form reading |
| `.type-body` | 16px | 400 | Default |
| `.type-small` | 14px | 400 | Supporting |
| `.type-meta` | 13px | 500 | Labels (mono) |

Avoid arbitrary Tailwind text sizes for content where these tokens apply.

---

## Measure & rhythm

* Long-form max-width: **680–720px** (`--content` / `--measure`)
* ~**60–75 characters** per line target
* Heading → paragraph: **24px** (`--space-3`)
* Content groups: **48px** (`--space-5`)
* Major sections: **96–128px** (`.section`)

---

## Content types

| Class | Purpose |
| ----- | ------- |
| `.text-narrative` | Story paragraphs |
| `.list-intentional` | Spaced em-dash lists |
| `.pull-quote` | Key statements, gold left border |
| `.key-statement` | Closing emphasis lines |
| `.reflection-prompt` | Contemplative prompts |
| `.faq-item` / `.faq-body` | Accordion content |
| `.prose-editorial` | Constrained long-form block |

---

## Interactive states

Buttons (`.btn*`): hover, focus-visible (gold outline), active, disabled.  
Fields: hover, focus (gold underline), disabled, placeholder = tertiary.  
FAQ summaries: focus-visible, open border.  
Links: `.link-inline` with underline accent on hover.

---

## Mobile

* Body ≥ **16px**
* Line-height **1.6–1.8**
* Side padding ≥ **20px**
* Measure constrained; lists wrap cleanly

---

## Source

`src/app/globals.css`
