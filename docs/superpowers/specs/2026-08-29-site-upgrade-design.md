# Hero Arena site upgrade — design

Date: 2026-08-29
Status: approved, ready for implementation planning
Branch: `feat/site-upgrade`

## Context

The site is a single-page React (CRA 5) app deployed on Vercel at
https://hero-arena-web-site.vercel.app/ (short link: https://bit.ly/Hero_Arena_HomePage).
It presents StranGen Group and its game Hero Arena in EN / RU / UZ.

Measured state before this work (local dev server, all images loaded):

| metric | value |
|---|---|
| total page weight | 47.5 MB |
| image weight | 47.1 MB |
| largest single asset | `screenshot4.png`, 11.1 MB |
| requests | 25 |

Five gallery screenshots account for 44 MB of that. On the production deploy the
browser tab froze while decoding them, which is a second cost beyond download:
each PNG is roughly 4000x2000 and expensive to decode on a phone.

Confirmed on production: `<meta name="description">` is still
`"Web site created using create-react-app"` and there are no Open Graph tags,
so links shared to Discord, Telegram or X render without a preview.

## Goals

The site serves three audiences on one page, in this priority order:

1. **Players** — the main path, top to bottom: game, gallery, trailers, community.
2. **Press and publishers** — one labelled block near the footer (phase 2).
3. **Investors** — the same block; the President Tech Award pitch video already
   speaks to them.

No separate routes. One page, one scroll.

Success is measurable: page weight under 2 MB, real-visitor Core Web Vitals in
Vercel Speed Insights, and event counts for the actions that matter.

## Non-goals

- Email capture / newsletter. The primary CTA points at the existing Discord and
  Telegram communities instead. Building capture means a backend, a database,
  GDPR obligations and a mail service, to collect something worth less
  pre-launch than a community member.
- Press kit. Dropped from this scope entirely — no button, no ZIP, no event.
  It needs content that does not exist yet and will be its own task.
- Migration to Next.js or Vite. A single static page does not need SSR, and
  Vercel already serves the CRA build well.
- Any change to the section order or the existing art direction.

## Phase 1 — foundations and re-skin

Ships without any new content from the client.

### 1.1 Design tokens

One set of CSS custom properties on `:root`, overridden under
`[data-theme="dark"]`. Existing SCSS variables in `src/assets/styles/root.scss`
resolve to these custom properties, so component styles keep working while they
are migrated.

Palettes are sampled from the actual logo files, not invented:

**Hero Arena** (`gameLogo.png`): orange `#f09000`–`#f0a800`, sky blue `#30c0f0`,
deep blue `#0078a8`, near-black outline `#001818`.

**StranGen** (`logo_str.png`): blood red `#c03048`, near-black `#181818`.

```scss
:root {
  --bg:           #ffffff;
  --bg-elevated:  #f4f6f8;
  --ink:          #101418;
  --ink-muted:    #5a6572;
  --line:         rgba(16, 20, 24, .10);

  --ha-orange:      #f09000;
  --ha-orange-deep: #d87800;
  --ha-blue:        #0078a8;
  --ha-blue-bright: #30c0f0;

  --sg-red:  #c03048;
  --sg-ink:  #181818;
}

[data-theme="dark"] {
  --bg:          #0c1016;
  --bg-elevated: #141a22;
  --ink:         #eef1f5;
  --ink-muted:   #9aa5b2;
  --line:        rgba(255, 255, 255, .10);

  --ha-blue: #30c0f0;
  --sg-red:  #e03a56;
}
```

Contrast rules, non-negotiable:

- Orange is a fill colour, never body text on white — `#f09000` on white is
  2.2:1. Buttons use orange fill with a near-black label.
- Link blue is `#0078a8` on light (4.6:1, AA) and `#30c0f0` on dark.
- Red is `#c03048` on light, lightened to `#e03a56` on dark.

Palette assignment gives the page a "studio presents game" structure:

- **StranGen red / near-black** frames the studio: header, footer, preloader,
  the "We make games!" block.
- **Hero Arena blue / orange** owns the game: hero, gallery, trailers, CTAs.

### 1.2 Theme toggle

Control sits beside the language switcher in the header.

- Default: `prefers-color-scheme`.
- Choice persists in `localStorage`.
- `data-theme` is applied to `<html>` by a small inline script in
  `public/index.html` that runs before React mounts, so dark-mode visitors never
  see a white flash.

### 1.3 Image pipeline

A `sharp`-backed dev script exposed as `npm run images`, run once now and again
whenever the art changes.

- Gallery screenshots: WebP at 800w and 1600w, quality 80, delivered with
  `srcset` + `sizes`.
- `mage.png`, phone mockups, `bg1.png`: WebP at a single width matched to their
  largest on-screen size.
- Source PNGs move to a top-level `art-source/` directory, outside `src/`, so no
  import can pull an 11 MB file into the bundle again.
- Every `<img>` gets explicit `width` and `height` to remove the layout shift
  visible today when scrolling into the gallery.

Target: under 2 MB total page weight, verified by measurement, not assertion.

### 1.4 Foundations

- **Preloader**: remove `setTimeout(2500)`. Hide when the hero image has actually
  loaded, with a 1.5s ceiling so it can never hang.
- **Meta**: per-language `<meta name="description">`, Open Graph and Twitter card
  tags. The share image is a 1200x630 JPEG cropped from the Hero Arena key art,
  produced by the same `npm run images` script and served from `public/`.
- **Manifest**: real name, Hero Arena icons, brand `theme_color` — currently
  still the Create React App sample.
- **Favicon**: `public/index.html` requests `heroArena.ico`; the file on disk is
  `HeroArena.ico`. Broken on any case-sensitive host. Standardise on
  `public/favicon.ico`, referenced identically from `index.html` and
  `manifest.json`; delete `favicon1.ico`.
- **Language**: persist to `localStorage`, detect from `navigator.language` on
  first visit, keep `<html lang>` in sync with the selection.
- **Gallery modal**: Esc closes it, focus is trapped while open, focus returns to
  the originating thumbnail on close.
- **Dead code**: delete `src/component/contact/`, `src/utils/scroll.js`,
  `src/assets/styles/main.scss`, and the duplicate `fade-in-up` keyframe in
  `animations.scss`.

### 1.5 Analytics

`@vercel/analytics` and `@vercel/speed-insights`, mounted in `App.js`. Cookieless,
so no consent banner is required. Free on the current Vercel tier.

Custom events:

| event | payload | question it answers |
|---|---|---|
| `cta_click` | `target`: discord / telegram / google_play / app_store | what converts |
| `trailer_play` | `video`: pitch / trailer | which video earns attention |
| `gallery_open` | `index` | which art sells the game |
| `language_switch` | `to`: en / ru / uz | where to spend marketing |
| `social_click` | `network` | which channel pulls |

Speed Insights supplies real-visitor Core Web Vitals, which makes the image work
provable rather than claimed.

## Phase 2 — content and structure

Blocked on content from the client. Listed here so the shape is agreed, not to be
built yet.

- A real hero section with a clear primary CTA (Discord until store listings
  exist; real install links after).
- A "what is Hero Arena" feature block — short game description in EN, with RU
  and UZ translations.
- An optional hero-roster section, if hero names and art are available.
- A press and partners block: studio info, the Tech Award pitch video, contact
  email. No press kit.

Needed from the client: short game description (EN), hero names and art,
team info, partner contact email.

## Verification

- Page weight and request count measured in the browser before and after, on the
  same page state, and reported as numbers.
- Both themes checked at desktop and mobile widths.
- Keyboard-only pass over the header, language menu, theme toggle and gallery
  modal.
- Every change deployed to a Vercel preview URL and reviewed there before
  anything reaches production.

## Working agreement

Branch `feat/site-upgrade`. Phase 1 lands as reviewable commits, one concern per
commit. Nothing merges to `master` without a preview deploy and sign-off.
