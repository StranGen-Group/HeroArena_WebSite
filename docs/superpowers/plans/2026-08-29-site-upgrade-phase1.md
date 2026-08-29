# Hero Arena Site Upgrade — Phase 1 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Cut the Hero Arena site from 47.5 MB to under 2 MB, re-skin it in the real StranGen and Hero Arena brand palettes with working light and dark themes, fix the broken metadata, and add cookieless analytics — without changing the section order or the art direction.

**Architecture:** The site stays a single-page CRA app on Vercel. Colour moves from hardcoded SCSS values to CSS custom properties on `:root`, overridden under `[data-theme="dark"]`, so both themes come from one token set. Source PNGs move out of `src/` into `art-source/` and a `sharp` script emits WebP derivatives that components import; nothing large can reach the bundle by accident. Analytics is two Vercel packages plus a thin `track()` wrapper so components never import the vendor SDK directly.

**Tech Stack:** React 19, react-scripts 5 (CRA), Sass 1.93, Swiper 12, sharp (dev only), `@vercel/analytics`, `@vercel/speed-insights`, Jest + React Testing Library (bundled with CRA).

**Spec:** `docs/superpowers/specs/2026-08-29-site-upgrade-design.md`

## Global Constraints

- Branch: `feat/site-upgrade`. One concern per commit. Nothing merges to `master` without a Vercel preview and sign-off.
- Section order and art direction do not change. No new sections in phase 1.
- Palettes are exactly the values sampled from the logos. Light: `--bg #ffffff`, `--bg-elevated #f4f6f8`, `--ink #101418`, `--ink-muted #5a6572`, `--line rgba(16,20,24,.10)`, `--ha-orange #f09000`, `--ha-orange-deep #d87800`, `--ha-blue #0078a8`, `--ha-blue-bright #30c0f0`, `--sg-red #c03048`, `--sg-ink #181818`. Dark overrides: `--bg #0c1016`, `--bg-elevated #141a22`, `--ink #eef1f5`, `--ink-muted #9aa5b2`, `--line rgba(255,255,255,.10)`, `--ha-blue #30c0f0`, `--sg-red #e03a56`.
- Orange is a fill colour only — never body text on white (2.2:1). Link blue is `#0078a8` on light, `#30c0f0` on dark. Red is `#c03048` on light, `#e03a56` on dark.
- StranGen red/near-black frames the studio (header, footer, preloader, "We make games!"). Hero Arena blue/orange owns the game sections (hero, gallery, trailers, CTAs).
- No email capture, no press kit, no framework migration. Primary CTA is Discord.
- Every `<img>` carries explicit `width` and `height`.
- Tests run one-shot with `set CI=true&& npm test` on Windows cmd, or `CI=true npm test` in bash. Watch mode is the default and will hang an automated run.

---

## File Structure

**Created:**
- `scripts/optimize-images.js` — sharp pipeline, source `art-source/`, output `src/assets/image/**` + `public/og-image.jpg`
- `src/assets/styles/tokens.scss` — the two-theme custom property set
- `src/hooks/useTheme.js` — theme state, persistence, system-preference default
- `src/component/themeToggle/ThemeToggle.js` + `.scss` — the header control
- `src/hooks/useTheme.test.js`, `src/utils/analytics.test.js`, `src/context/LanguageContext.test.js` — unit tests
- `src/utils/analytics.js` — `track(event, props)` wrapper over `@vercel/analytics`
- `art-source/` — original PNGs, outside the bundle

**Modified:**
- `src/assets/styles/root.scss` — SCSS variables resolve to custom properties
- `src/App.js` — Analytics + SpeedInsights mounts, preloader condition
- `src/App.test.js` — replace the CRA stub (it currently fails)
- `src/component/preloader/Preloader.js` — real load condition, StranGen palette
- `src/component/header/Header.js` + `.scss` — theme toggle, tokens
- `src/component/headerContent/HeaderContent.js` + `.scss` — WebP, tokens
- `src/component/hero/HeroSection.js` + `.scss` — WebP, tokens, CTA events
- `src/component/slider/HeroSectionSlider.js` + `.scss` — srcset, modal a11y, events
- `src/component/section/Section.js` + `.scss` — WebP, tokens, social events
- `src/component/video/VideoContent.js` + `.scss` — tokens, trailer events
- `src/component/footer/Footer.js` + `.scss` — tokens, CTA events
- `src/context/LanguageContext.js` — persistence, browser detection, `<html lang>`
- `src/constants/slider.js` — WebP srcset data
- `public/index.html` — meta, OG, favicon, pre-mount theme script
- `public/manifest.json` — real app identity
- `package.json` — sharp devDependency, `images` script, analytics deps

**Deleted:**
- `src/component/contact/` (unused), `src/utils/scroll.js` (unused), `src/assets/styles/main.scss` (unused), `public/favicon1.ico`
- Duplicate `fade-in-up` keyframe in `src/assets/styles/animations.scss`

---

## Task 1: Image pipeline

Biggest measurable win, and independent of everything else. Do it first.

**Files:**
- Create: `scripts/optimize-images.js`, `art-source/` (moved originals)
- Modify: `package.json`, `src/constants/slider.js`, `src/component/headerContent/HeaderContent.js`, `src/component/hero/HeroSection.js`, `src/component/section/Section.js`, `src/component/hero/HeroSection.scss:8`, `src/component/section/Section.scss:8`
- Test: manual measurement in the browser (documented below)

**Interfaces:**
- Consumes: nothing
- Produces: `src/constants/slider.js` exports `SLIDER_SLIDES` as `[{ id: number, src: string, srcSet: string, width: 1600, height: 842 }]`; WebP files at `src/assets/image/<category>/<name>.webp` and `<name>-800.webp` / `<name>-1600.webp` for gallery screenshots; `public/og-image.jpg`

- [ ] **Step 1: Record the baseline**

Start the dev server (`npm start`), open http://localhost:3000, scroll to the bottom so the lazy gallery images load, then run this in the browser console and save the output into the commit message later:

```js
const rs = performance.getEntriesByType('resource');
console.log({
  totalMB: +(rs.reduce((a, e) => a + (e.transferSize || 0), 0) / 1048576).toFixed(2),
  requests: rs.length,
});
```

Expected: roughly `{ totalMB: 47.5, requests: 25 }`.

- [ ] **Step 2: Install sharp and move the originals**

```bash
npm install --save-dev sharp
mkdir -p art-source/background art-source/about art-source/phone art-source/logo
git mv src/assets/image/background/screenshot1.png art-source/background/
git mv src/assets/image/background/screenshot2.png art-source/background/
git mv src/assets/image/background/screenshot3.png art-source/background/
git mv src/assets/image/background/screenshot4.png art-source/background/
git mv src/assets/image/background/screenshot5.png art-source/background/
git mv src/assets/image/background/bg1.png art-source/background/
git mv src/assets/image/background/Town.png art-source/background/
git mv src/assets/image/about/mage.png art-source/about/
git mv src/assets/image/about/about-image.png art-source/about/
git mv src/assets/image/phone/iPhone1.png art-source/phone/
git mv src/assets/image/phone/iPhoneBg.png art-source/phone/
git mv src/assets/image/logo/gameLogo.png art-source/logo/
```

`Town.png`, `about-image.png` and `src/assets/image/icons/facebook.png` are referenced nowhere in `src/` — they move to `art-source/` (or stay deleted) rather than being converted. `logo_str.png` (38 KB) and the SVG icons stay where they are; they are already small.

- [ ] **Step 3: Write the conversion script**

Create `scripts/optimize-images.js`:

```js
const path = require('path');
const fs = require('fs');
const sharp = require('sharp');

const SRC = path.join(__dirname, '..', 'art-source');
const OUT = path.join(__dirname, '..', 'src', 'assets', 'image');
const PUBLIC = path.join(__dirname, '..', 'public');

// [source, output dir, output basename, widths]
const JOBS = [
  ['background/screenshot1.png', 'background', 'screenshot1', [800, 1600]],
  ['background/screenshot2.png', 'background', 'screenshot2', [800, 1600]],
  ['background/screenshot3.png', 'background', 'screenshot3', [800, 1600]],
  ['background/screenshot4.png', 'background', 'screenshot4', [800, 1600]],
  ['background/screenshot5.png', 'background', 'screenshot5', [800, 1600]],
  ['background/bg1.png', 'background', 'bg1', [1600]],
  ['about/mage.png', 'about', 'mage', [900]],
  ['phone/iPhone1.png', 'phone', 'iPhone1', [1200]],
  ['phone/iPhoneBg.png', 'phone', 'iPhoneBg', [1200]],
  ['logo/gameLogo.png', 'logo', 'gameLogo', [320]],
];

async function run() {
  for (const [rel, dir, base, widths] of JOBS) {
    const input = path.join(SRC, rel);
    const outDir = path.join(OUT, dir);
    fs.mkdirSync(outDir, { recursive: true });

    for (const width of widths) {
      // single-width assets keep a plain name; multi-width ones are suffixed
      const name = widths.length === 1 ? `${base}.webp` : `${base}-${width}.webp`;
      const out = path.join(outDir, name);
      const info = await sharp(input).resize({ width, withoutEnlargement: true })
        .webp({ quality: 80 }).toFile(out);
      console.log(`${name}  ${info.width}x${info.height}  ${(info.size / 1024).toFixed(0)} KB`);
    }
  }

  // Open Graph share image: 1200x630 centre crop of the key art
  const og = path.join(PUBLIC, 'og-image.jpg');
  const ogInfo = await sharp(path.join(SRC, 'background/bg1.png'))
    .resize({ width: 1200, height: 630, fit: 'cover', position: 'centre' })
    .jpeg({ quality: 82 }).toFile(og);
  console.log(`og-image.jpg  1200x630  ${(ogInfo.size / 1024).toFixed(0)} KB`);
}

run().catch((err) => { console.error(err); process.exit(1); });
```

- [ ] **Step 4: Add the npm script**

In `package.json`, inside `"scripts"`:

```json
"images": "node scripts/optimize-images.js",
```

- [ ] **Step 5: Run it and check the output sizes**

Run: `npm run images`
Expected: every gallery screenshot at 1600w lands under 400 KB; `mage.webp` under 150 KB. If a screenshot exceeds 400 KB, drop that job's quality to 72 and re-run — do not raise it.

- [ ] **Step 6: Point the gallery at the new files**

Replace the contents of `src/constants/slider.js` image imports and `SLIDER_SLIDES` with:

```js
import slide1_800 from '../assets/image/background/screenshot1-800.webp';
import slide1_1600 from '../assets/image/background/screenshot1-1600.webp';
import slide2_800 from '../assets/image/background/screenshot2-800.webp';
import slide2_1600 from '../assets/image/background/screenshot2-1600.webp';
import slide3_800 from '../assets/image/background/screenshot3-800.webp';
import slide3_1600 from '../assets/image/background/screenshot3-1600.webp';
import slide4_800 from '../assets/image/background/screenshot4-800.webp';
import slide4_1600 from '../assets/image/background/screenshot4-1600.webp';
import slide5_800 from '../assets/image/background/screenshot5-800.webp';
import slide5_1600 from '../assets/image/background/screenshot5-1600.webp';

const slide = (id, small, large) => ({
  id,
  src: large,
  srcSet: `${small} 800w, ${large} 1600w`,
  width: 1600,
  height: 842,
});

export const SLIDER_SLIDES = [
  slide(1, slide1_800, slide1_1600),
  slide(2, slide2_800, slide2_1600),
  slide(3, slide3_800, slide3_1600),
  slide(4, slide4_800, slide4_1600),
  slide(5, slide5_800, slide5_1600),
];
```

`height: 842` assumes the screenshots keep their 1.9:1 ratio at 1600w — read the actual height printed by `npm run images` in Step 5 and use that number.

`SLIDER_CONFIG` in the same file is unchanged.

- [ ] **Step 7: Use srcset in the slider markup**

In `src/component/slider/HeroSectionSlider.js`, both the thumbnail `<img>` and the modal `<img>` take the new fields. Thumbnail:

```jsx
<img
  src={slide.src}
  srcSet={slide.srcSet}
  sizes="(max-width: 767px) 100vw, (max-width: 1023px) 50vw, 33vw"
  width={slide.width}
  height={slide.height}
  alt="Hero Arena gameplay screenshot"
  className="slider__slide-image"
  loading="lazy"
/>
```

Modal image — same `src`/`srcSet`, but `sizes="100vw"` and `loading="eager"`, keeping its existing `className="slider-modal__image"`.

- [ ] **Step 8: Point the remaining components at WebP**

Three import swaps:

```js
// src/component/headerContent/HeaderContent.js:3
import aboutImage from '../../assets/image/about/mage.webp';

// src/component/hero/HeroSection.js:3
import heroImage from '../../assets/image/phone/iPhoneBg.webp';

// src/component/section/Section.js:3
import heroImage from '../../assets/image/phone/iPhone1.webp';
```

Two SCSS background swaps — `src/component/hero/HeroSection.scss:8` and `src/component/section/Section.scss:8`:

```scss
background: url('../../assets/image/background/bg1.webp') no-repeat center/cover;
```

And `src/component/header/Header.js:3`:

```js
import LogoGame from '../../assets/image/logo/gameLogo.webp';
```

- [ ] **Step 9: Add width/height to every remaining img**

Each of these `<img>` elements gets explicit dimensions matching the generated file (use the numbers `npm run images` printed):

- `HeaderContent.js` — `mage.webp`, `width={900}` and its printed height
- `HeroSection.js` — `iPhoneBg.webp`, `width={1200}` and its printed height
- `Section.js` — `iPhone1.webp`, `width={1200}` and its printed height
- `Header.js` — `gameLogo.webp`, `width={320}` and its printed height

- [ ] **Step 10: Verify in the browser**

Run `npm start`, hard-reload http://localhost:3000, scroll to the bottom, re-run the Step 1 snippet.
Expected: `totalMB` under 2. Every image visibly renders — check the header logo, mage, both phone mockups, both section backgrounds, all five gallery slides and the modal.

- [ ] **Step 11: Commit**

```bash
git add -A
git commit -m "perf: convert site images to WebP, move sources out of src

Page weight 47.5 MB -> <measured> MB. Gallery screenshots ship at 800w/1600w
via srcset; originals live in art-source/ so they cannot enter the bundle."
```

---

## Task 2: Design tokens and theme switching

**Files:**
- Create: `src/assets/styles/tokens.scss`, `src/hooks/useTheme.js`, `src/hooks/useTheme.test.js`, `src/component/themeToggle/ThemeToggle.js`, `src/component/themeToggle/ThemeToggle.scss`
- Modify: `src/assets/styles/root.scss`, `src/App.scss`, `src/component/header/Header.js`, `src/setupTests.js`, `public/index.html`
- Test: `src/hooks/useTheme.test.js`

**Interfaces:**
- Consumes: nothing
- Produces: `useTheme()` returning `{ theme: 'light' | 'dark', toggleTheme: () => void }`; the CSS custom properties listed in Global Constraints; `<ThemeToggle />` rendering a `<button>` with `aria-label="Switch to dark theme"` / `"Switch to light theme"`

- [ ] **Step 1: Teach jsdom about matchMedia**

CRA's jsdom has no `window.matchMedia`, so any component reading it throws in tests. Append to `src/setupTests.js`:

```js
// jsdom does not implement matchMedia; useTheme reads it for the system default
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: (query) => ({
    matches: false,
    media: query,
    onchange: null,
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => false,
  }),
});
```

- [ ] **Step 2: Write the failing test**

Create `src/hooks/useTheme.test.js`:

```js
import { renderHook, act } from '@testing-library/react';
import useTheme from './useTheme';

beforeEach(() => {
  localStorage.clear();
  document.documentElement.removeAttribute('data-theme');
});

test('defaults to light when the system has no dark preference', () => {
  const { result } = renderHook(() => useTheme());
  expect(result.current.theme).toBe('light');
  expect(document.documentElement.getAttribute('data-theme')).toBe('light');
});

test('restores the stored choice over the system preference', () => {
  localStorage.setItem('theme', 'dark');
  const { result } = renderHook(() => useTheme());
  expect(result.current.theme).toBe('dark');
  expect(document.documentElement.getAttribute('data-theme')).toBe('dark');
});

test('toggling flips the theme, the attribute and storage', () => {
  const { result } = renderHook(() => useTheme());
  act(() => result.current.toggleTheme());
  expect(result.current.theme).toBe('dark');
  expect(document.documentElement.getAttribute('data-theme')).toBe('dark');
  expect(localStorage.getItem('theme')).toBe('dark');
});
```

- [ ] **Step 3: Run it and watch it fail**

Run: `CI=true npm test -- useTheme`
Expected: FAIL — `Cannot find module './useTheme'`.

- [ ] **Step 4: Implement the hook**

Create `src/hooks/useTheme.js`:

```js
import { useCallback, useEffect, useState } from 'react';

const STORAGE_KEY = 'theme';

const initialTheme = () => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === 'light' || stored === 'dark') return stored;
  } catch (e) {
    // private mode or blocked storage — fall through to the system preference
  }
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
};

const useTheme = () => {
  const [theme, setTheme] = useState(initialTheme);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    try {
      localStorage.setItem(STORAGE_KEY, theme);
    } catch (e) {
      // storage unavailable — the attribute is still applied for this session
    }
  }, [theme]);

  const toggleTheme = useCallback(() => {
    setTheme((current) => (current === 'dark' ? 'light' : 'dark'));
  }, []);

  return { theme, toggleTheme };
};

export default useTheme;
```

- [ ] **Step 5: Run the test again**

Run: `CI=true npm test -- useTheme`
Expected: PASS, 3 tests.

- [ ] **Step 6: Write the token sheet**

Create `src/assets/styles/tokens.scss` with exactly the values from Global Constraints:

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

  --sg-red: #c03048;
  --sg-ink: #181818;

  --shadow-card: 0 12px 32px -16px rgba(16, 20, 24, .35);
  --radius:      14px;
}

[data-theme="dark"] {
  --bg:          #0c1016;
  --bg-elevated: #141a22;
  --ink:         #eef1f5;
  --ink-muted:   #9aa5b2;
  --line:        rgba(255, 255, 255, .10);

  --ha-blue: #30c0f0;
  --sg-red:  #e03a56;

  --shadow-card: 0 12px 32px -16px rgba(0, 0, 0, .8);
}
```

- [ ] **Step 7: Route the SCSS variables through the tokens**

In `src/assets/styles/root.scss`, keep the variable names (every component imports them) but resolve them to custom properties, and add the display font:

```scss
/* Цвета — значения живут в tokens.scss, здесь только псевдонимы */
$color-primary: var(--ha-orange);
$color-secondary: var(--ha-blue);
$color-black: var(--ink);
$color-white: var(--bg);
$color-gray-dark: var(--ink-muted);
$color-gray-light: var(--line);
$color-brand-red: var(--sg-red);

/* Типографика */
$font-primary: 'Inter', system-ui, -apple-system, 'Segoe UI', sans-serif;
$font-display: 'Baloo 2', 'Inter', system-ui, sans-serif;
```

Keep the existing spacing and breakpoint variables untouched.

`$font-display` is a rounded, friendly face that matches the Hero Arena logo lettering far better than Arial. Load both from Google Fonts in `public/index.html`:

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Baloo+2:wght@600;700;800&family=Inter:wght@400;500;600&display=swap" rel="stylesheet">
```

- [ ] **Step 8: Import the tokens and paint the page background**

At the top of `src/App.scss`, before the existing imports:

```scss
@import './assets/styles/tokens';
```

and change the `body` rule's colours to the tokens:

```scss
body {
  font-family: $font-primary;
  line-height: 1.6;
  background: var(--bg);
  color: var(--ink);
  overflow-x: hidden;
  transition: background-color .3s ease, color .3s ease;
}
```

- [ ] **Step 9: Kill the white flash before React mounts**

In `public/index.html`, as the first element inside `<head>` after the charset meta:

```html
<script>
  (function () {
    try {
      var stored = localStorage.getItem('theme');
      var theme = stored === 'light' || stored === 'dark'
        ? stored
        : (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
      document.documentElement.setAttribute('data-theme', theme);
    } catch (e) {
      document.documentElement.setAttribute('data-theme', 'light');
    }
  })();
</script>
```

- [ ] **Step 10: Build the toggle control**

Create `src/component/themeToggle/ThemeToggle.js`:

```jsx
import React from 'react';
import './ThemeToggle.scss';
import useTheme from '../../hooks/useTheme';

const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <button
      className="theme-toggle"
      onClick={toggleTheme}
      aria-label={isDark ? 'Switch to light theme' : 'Switch to dark theme'}
      title={isDark ? 'Switch to light theme' : 'Switch to dark theme'}
    >
      {isDark ? (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <circle cx="12" cy="12" r="4.5" stroke="currentColor" strokeWidth="2" />
          <path d="M12 2v2M12 20v2M2 12h2M20 12h2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M19.1 4.9l-1.4 1.4M6.3 17.7l-1.4 1.4"
                stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
      ) : (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M20 14.5A8.5 8.5 0 0 1 9.5 4a8.5 8.5 0 1 0 10.5 10.5Z"
                stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
        </svg>
      )}
    </button>
  );
};

export default ThemeToggle;
```

Create `src/component/themeToggle/ThemeToggle.scss`:

```scss
@import '../../assets/styles/root';

.theme-toggle {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 38px;
  height: 38px;
  border-radius: 50%;
  border: 1px solid var(--line);
  background: var(--bg-elevated);
  color: var(--ink);
  cursor: pointer;
  transition: border-color .25s ease, color .25s ease, transform .25s ease;

  &:hover {
    color: var(--sg-red);
    border-color: var(--sg-red);
    transform: translateY(-1px);
  }

  &:focus-visible {
    outline: 2px solid var(--ha-blue);
    outline-offset: 2px;
  }
}
```

- [ ] **Step 11: Mount it in the header**

In `src/component/header/Header.js`, import `ThemeToggle` and render it inside `div.header__buttons`, immediately before the `div.header__lang` element.

- [ ] **Step 12: Verify both themes in the browser**

Run `npm start`, click the toggle. Expected: page background flips between `#ffffff` and `#0c1016`, the choice survives a reload, and starting with `localStorage.clear()` plus the browser set to dark mode loads dark with no white flash.

- [ ] **Step 13: Commit**

```bash
git add -A
git commit -m "feat: add light/dark design tokens and theme toggle

Palettes sampled from the StranGen and Hero Arena logos. Theme is applied to
<html> before React mounts so dark-mode visitors never see a white flash."
```

---

## Task 3: Re-skin the components

Colour only — no layout, no section order, no copy changes.

**Files:**
- Modify: `src/component/header/Header.scss`, `src/component/preloader/Preloader.scss`, `src/component/footer/Footer.scss`, `src/component/headerContent/HeaderContent.scss`, `src/component/hero/HeroSection.scss`, `src/component/slider/HeroSectionSlider.scss`, `src/component/section/Section.scss`, `src/component/video/VideoContent.scss`
- Test: browser verification in both themes at 1440px and 390px

**Interfaces:**
- Consumes: the custom properties from Task 2
- Produces: no JS surface

- [ ] **Step 1: Find every hardcoded colour**

Run: `grep -rn "#[0-9a-fA-F]\{3,8\}\|rgba\?(" src/component --include=*.scss`
Every hit is a candidate. Work through the files one at a time in the order listed above, replacing literals with tokens.

- [ ] **Step 2: Re-skin the studio frame (StranGen red / near-black)**

`Header.scss`, `Preloader.scss`, `Footer.scss`, `HeaderContent.scss`:

- Surfaces: `background: var(--bg)` on the header bar, `var(--bg-elevated)` on the dropdown and burger panels
- Text: `var(--ink)`, secondary text `var(--ink-muted)`
- Borders and dividers: `1px solid var(--line)`
- Hover / active / focus accents and the preloader spinner: `var(--sg-red)`
- The "We make games!" heading uses `font-family: $font-display`

- [ ] **Step 3: Re-skin the game sections (Hero Arena blue / orange)**

`HeroSection.scss`, `HeroSectionSlider.scss`, `Section.scss`, `VideoContent.scss`:

- Store buttons and any primary CTA: `background: var(--ha-orange)` with `color: #101418` — never orange text on a light surface
- Button hover: `background: var(--ha-orange-deep)`
- Links, slider pagination bullets, nav arrows: `var(--ha-blue)`
- Section headings: `font-family: $font-display`
- Cards, slides and the modal shell: `background: var(--bg-elevated)`, `border-radius: var(--radius)`, `box-shadow: var(--shadow-card)`
- The `hero__shape--cyan` decorative blob becomes `var(--ha-blue-bright)` at low opacity so it reads in both themes

- [ ] **Step 4: Add a visible focus ring everywhere**

Every interactive element — nav links, language items, store buttons, social icons, slider arrows, modal close — gets:

```scss
&:focus-visible {
  outline: 2px solid var(--ha-blue);
  outline-offset: 2px;
}
```

- [ ] **Step 5: Check the section backgrounds survive dark mode**

`HeroSection.scss` and `Section.scss` sit on the `bg1.webp` photo background. Text over them must stay readable in both themes — add a scrim rather than changing the text colour:

```scss
&::before {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(90deg, rgba(8, 12, 18, .82) 0%, rgba(8, 12, 18, .45) 55%, rgba(8, 12, 18, .15) 100%);
  pointer-events: none;
}
```

Text inside those two sections stays light in both themes (it sits on the photo, not on `--bg`), so it uses a literal `#f4f6f8` rather than `var(--ink)`.

- [ ] **Step 6: Verify**

Run `npm start`. In both themes, at 1440px and 390px width, check: header, "We make games!", hero with store buttons, gallery slider and modal, socials section, both trailers, footer. Nothing may be invisible, low-contrast, or clipped.

- [ ] **Step 7: Commit**

```bash
git add -A
git commit -m "style: re-skin components onto brand tokens

StranGen red/near-black frames the studio; Hero Arena blue/orange owns the game
sections. Focus rings added to every interactive element."
```

---

## Task 4: Metadata, preloader and language persistence

**Files:**
- Modify: `public/index.html`, `public/manifest.json`, `src/App.js`, `src/component/preloader/Preloader.js`, `src/context/LanguageContext.js`, `src/App.test.js`
- Delete: `public/favicon1.ico`
- Test: `src/context/LanguageContext.test.js` (create), `src/App.test.js` (replace)

**Interfaces:**
- Consumes: nothing
- Produces: `LanguageProvider` persists to `localStorage` under key `language`; `useLanguage()` keeps its existing shape `{ language, setLanguage, translations, t, scrollToSection, getCurrentTranslations }`

- [ ] **Step 1: Write the failing language test**

Create `src/context/LanguageContext.test.js`:

```js
import { render, screen, act } from '@testing-library/react';
import { LanguageProvider, useLanguage } from './LanguageContext';

const Probe = () => {
  const { language, setLanguage } = useLanguage();
  return <button onClick={() => setLanguage('RU')}>{language}</button>;
};

const renderProbe = () => render(<LanguageProvider><Probe /></LanguageProvider>);

beforeEach(() => {
  localStorage.clear();
  document.documentElement.lang = '';
});

test('restores the stored language', () => {
  localStorage.setItem('language', 'UZ');
  renderProbe();
  expect(screen.getByRole('button')).toHaveTextContent('UZ');
});

test('picks up the browser language on a first visit', () => {
  jest.spyOn(navigator, 'language', 'get').mockReturnValue('ru-RU');
  renderProbe();
  expect(screen.getByRole('button')).toHaveTextContent('RU');
});

test('persists a change and syncs the html lang attribute', () => {
  renderProbe();
  act(() => { screen.getByRole('button').click(); });
  expect(localStorage.getItem('language')).toBe('RU');
  expect(document.documentElement.lang).toBe('ru');
});
```

- [ ] **Step 2: Run it and watch it fail**

Run: `CI=true npm test -- LanguageContext`
Expected: FAIL — the first test reports `EN`, because nothing reads storage yet.

- [ ] **Step 3: Implement persistence and detection**

In `src/context/LanguageContext.js`, replace the `useState(DEFAULT_LANGUAGE)` line and add an effect:

```js
import React, { createContext, useState, useContext, useEffect } from 'react';
import { TRANSLATIONS, DEFAULT_LANGUAGE, LANGUAGES } from '../constants/translations';

const STORAGE_KEY = 'language';

const initialLanguage = () => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored && TRANSLATIONS[stored]) return stored;
  } catch (e) {
    // storage blocked — fall through to browser detection
  }
  const browser = (navigator.language || '').slice(0, 2).toUpperCase();
  return TRANSLATIONS[browser] ? browser : DEFAULT_LANGUAGE;
};
```

then inside the provider:

```js
const [language, setLanguage] = useState(initialLanguage);

useEffect(() => {
  document.documentElement.lang = language.toLowerCase();
  try {
    localStorage.setItem(STORAGE_KEY, language);
  } catch (e) {
    // storage blocked — the lang attribute is still correct for this session
  }
}, [language]);
```

`LANGUAGES` is imported only if it is not already; check the existing import line first and do not duplicate it.

- [ ] **Step 4: Run the test again**

Run: `CI=true npm test -- LanguageContext`
Expected: PASS, 3 tests.

- [ ] **Step 5: Make the preloader honest**

In `src/App.js`, replace the `setTimeout(ANIMATION_CONFIG.PRELOADER_DURATION)` effect with a real load condition plus a hard ceiling:

```js
useEffect(() => {
  const done = () => setIsLoading(false);
  // ceiling: never hold the page hostage if an asset stalls
  const ceiling = setTimeout(done, 1500);

  if (document.readyState === 'complete') {
    done();
  } else {
    window.addEventListener('load', done);
  }

  return () => {
    clearTimeout(ceiling);
    window.removeEventListener('load', done);
  };
}, []);
```

Then delete `PRELOADER_DURATION` from `src/constants/animation.js` and its import in `App.js` if nothing else uses it (`grep -rn "PRELOADER_DURATION" src`).

- [ ] **Step 6: Replace the broken CRA test**

`src/App.test.js` currently asserts on "learn react" and fails. Replace it:

```js
import { render, screen } from '@testing-library/react';
import App from './App';

test('renders the site header once loading finishes', async () => {
  render(<App />);
  expect(await screen.findByRole('banner')).toBeInTheDocument();
});
```

`<header>` maps to the `banner` role, so this passes only once the preloader has actually handed over.

- [ ] **Step 7: Fix the document head**

In `public/index.html`, replace the icon links, description and title with:

```html
<link rel="icon" href="%PUBLIC_URL%/favicon.ico" />
<link rel="apple-touch-icon" href="%PUBLIC_URL%/logo192.png" />
<meta name="description" content="Hero Arena — a hero-driven tower defense from StranGen Group. Recruit champions, upgrade them between waves, and hold the castle. In English, Russian and Uzbek." />
<meta name="theme-color" content="#0c1016" />

<meta property="og:type" content="website" />
<meta property="og:site_name" content="Hero Arena" />
<meta property="og:title" content="Hero Arena — hero-driven tower defense" />
<meta property="og:description" content="Recruit champions, upgrade them between waves, and hold the castle. From StranGen Group." />
<meta property="og:image" content="https://hero-arena-web-site.vercel.app/og-image.jpg" />
<meta property="og:url" content="https://hero-arena-web-site.vercel.app/" />

<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:title" content="Hero Arena — hero-driven tower defense" />
<meta name="twitter:description" content="Recruit champions, upgrade them between waves, and hold the castle. From StranGen Group." />
<meta name="twitter:image" content="https://hero-arena-web-site.vercel.app/og-image.jpg" />

<title>Hero Arena — Hero Tower Defense by StranGen Group</title>
```

OG tags must be static, so they stay English regardless of the selected UI language.

- [ ] **Step 8: Settle the favicon**

```bash
git mv public/HeroArena.ico public/favicon.ico
git rm public/favicon1.ico
```

- [ ] **Step 9: Fix the manifest**

Replace `public/manifest.json`:

```json
{
  "short_name": "Hero Arena",
  "name": "Hero Arena — StranGen Group",
  "icons": [
    { "src": "favicon.ico", "sizes": "64x64 32x32 24x24 16x16", "type": "image/x-icon" },
    { "src": "logo192.png", "type": "image/png", "sizes": "192x192" },
    { "src": "logo512.png", "type": "image/png", "sizes": "512x512" }
  ],
  "start_url": ".",
  "display": "standalone",
  "theme_color": "#0c1016",
  "background_color": "#0c1016"
}
```

- [ ] **Step 10: Run the whole suite**

Run: `CI=true npm test`
Expected: PASS — `useTheme` (3), `LanguageContext` (3), `App` (1).

- [ ] **Step 11: Verify in the browser**

Hard-reload. Expected: the preloader disappears as soon as the page finishes loading rather than after a fixed 2.5s; the favicon appears in the tab; switching to RU and reloading keeps RU; `document.documentElement.lang` reads `ru`.

- [ ] **Step 12: Commit**

```bash
git add -A
git commit -m "fix: real metadata, honest preloader, persistent language

Replaces the create-react-app description and sample manifest, adds OG/Twitter
cards, repairs the favicon filename mismatch, ties the preloader to actual page
load with a 1.5s ceiling, and persists the language choice with browser
detection on first visit."
```

---

## Task 5: Gallery modal accessibility and dead code

**Files:**
- Modify: `src/component/slider/HeroSectionSlider.js`
- Delete: `src/component/contact/ContactSection.js`, `src/component/contact/ContactSection.scss`, `src/utils/scroll.js`, `src/assets/styles/main.scss`
- Modify: `src/assets/styles/animations.scss` (remove the duplicate keyframe)
- Test: keyboard verification in the browser

**Interfaces:**
- Consumes: `SLIDER_SLIDES` from Task 1
- Produces: no new exports

- [ ] **Step 1: Confirm the dead files really are dead**

```bash
grep -rn "ContactSection\|utils/scroll\|main.scss" src public
```

Expected: only `src/component/contact/ContactSection.js` importing its own SCSS. If anything else appears, stop and report it instead of deleting.

- [ ] **Step 2: Delete them**

```bash
git rm -r src/component/contact
git rm src/utils/scroll.js src/assets/styles/main.scss
```

- [ ] **Step 3: Remove the duplicate keyframe**

`src/assets/styles/animations.scss` defines `@keyframes fade-in-up` twice — once at the top and again after `fade-in`. Delete the second block; keep the first.

- [ ] **Step 4: Add Esc-to-close and focus return to the modal**

In `src/component/slider/HeroSectionSlider.js`, add a ref for the element that opened the modal and an effect for the key handler:

```jsx
import React, { useState, useRef, useEffect, useCallback } from 'react';
```

Inside the component:

```jsx
const openerRef = useRef(null);
const modalRef = useRef(null);

const closeModal = useCallback(() => {
  setIsModalOpen(false);
  document.body.style.overflow = '';
  if (openerRef.current) openerRef.current.focus();
}, []);

const handleSlideClick = (index, event) => {
  openerRef.current = event.currentTarget;
  setSelectedSlideIndex(index);
  setIsModalOpen(true);
  document.body.style.overflow = 'hidden';
};

useEffect(() => {
  if (!isModalOpen) return undefined;

  const onKeyDown = (e) => {
    if (e.key === 'Escape') {
      closeModal();
      return;
    }
    if (e.key !== 'Tab' || !modalRef.current) return;

    // keep focus inside the dialog while it is open
    const focusable = modalRef.current.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    if (focusable.length === 0) return;
    const first = focusable[0];
    const last = focusable[focusable.length - 1];

    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  };

  document.addEventListener('keydown', onKeyDown);
  return () => document.removeEventListener('keydown', onKeyDown);
}, [isModalOpen, closeModal]);
```

- [ ] **Step 5: Wire the markup up**

- The slide click handler becomes `onClick={(event) => handleSlideClick(index, event)}`
- Each clickable slide div gets `role="button"`, `tabIndex={0}`, and `onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); handleSlideClick(index, e); } }}`
- The modal root gets `ref={modalRef}`, `role="dialog"`, `aria-modal="true"`, `aria-label="Gallery"`
- The close button gets `aria-label="Close gallery"` and, in an effect that runs when the modal opens, `.focus()` so the keyboard lands somewhere sensible

- [ ] **Step 6: Verify with the keyboard only**

Tab to a slide, press Enter — the modal opens and focus lands on the close button. Tab cycles inside the dialog and never escapes to the page behind. Esc closes it and focus returns to the slide that opened it.

- [ ] **Step 7: Run the suite**

Run: `CI=true npm test`
Expected: PASS, 7 tests, no console errors about missing modules.

- [ ] **Step 8: Commit**

```bash
git add -A
git commit -m "a11y: keyboard support for the gallery modal, remove dead code

Esc closes, focus is trapped while open and returns to the opening thumbnail.
Deletes the unused contact section, scroll util, main.scss and a duplicate
keyframe."
```

---

## Task 6: Analytics

**Files:**
- Create: `src/utils/analytics.js`, `src/utils/analytics.test.js`
- Modify: `src/App.js`, `src/component/hero/HeroSection.js`, `src/component/footer/Footer.js`, `src/component/section/Section.js`, `src/component/video/VideoContent.js`, `src/component/slider/HeroSectionSlider.js`, `src/component/header/Header.js`, `package.json`

**Interfaces:**
- Consumes: nothing
- Produces: `track(event: string, props?: Record<string, string | number>): void` from `src/utils/analytics.js`; event names `cta_click`, `trailer_play`, `gallery_open`, `language_switch`, `social_click`

- [ ] **Step 1: Install the packages**

```bash
npm install @vercel/analytics @vercel/speed-insights
```

- [ ] **Step 2: Write the failing wrapper test**

Create `src/utils/analytics.test.js`:

```js
import { track as vercelTrack } from '@vercel/analytics';
import { track } from './analytics';

jest.mock('@vercel/analytics', () => ({ track: jest.fn() }));

beforeEach(() => jest.clearAllMocks());

test('forwards the event name and properties', () => {
  track('cta_click', { target: 'discord' });
  expect(vercelTrack).toHaveBeenCalledWith('cta_click', { target: 'discord' });
});

test('sends an event with no properties', () => {
  track('gallery_open');
  expect(vercelTrack).toHaveBeenCalledWith('gallery_open', {});
});

test('never throws when the SDK fails', () => {
  vercelTrack.mockImplementation(() => { throw new Error('blocked'); });
  expect(() => track('cta_click', { target: 'telegram' })).not.toThrow();
});
```

- [ ] **Step 3: Run it and watch it fail**

Run: `CI=true npm test -- analytics`
Expected: FAIL — `Cannot find module './analytics'`.

- [ ] **Step 4: Implement the wrapper**

Create `src/utils/analytics.js`:

```js
import { track as vercelTrack } from '@vercel/analytics';

/**
 * Thin wrapper so components never import the vendor SDK directly, and so a
 * blocked or failing analytics script can never break a click handler.
 */
export const track = (event, props = {}) => {
  try {
    vercelTrack(event, props);
  } catch (e) {
    // an ad blocker ate the script — the user's click still has to work
  }
};

export default track;
```

- [ ] **Step 5: Run the test again**

Run: `CI=true npm test -- analytics`
Expected: PASS, 3 tests.

- [ ] **Step 6: Mount the collectors**

In `src/App.js`, import and render both inside the `.app` div, after `<Footer />`:

```jsx
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/react';
```

```jsx
<Analytics />
<SpeedInsights />
```

- [ ] **Step 7: Fire the events**

Each call site adds an `onClick` that calls `track` alongside whatever it already does — never replacing the existing behaviour:

- `HeroSection.js` — Google Play link: `track('cta_click', { target: 'google_play' })`; App Store link: `track('cta_click', { target: 'app_store' })`
- `Footer.js` — same two, plus each social anchor: `track('social_click', { network: link.alt.toLowerCase() })`
- `Section.js` — each social anchor: `track('social_click', { network: link.alt.toLowerCase() })`
- `HeroSectionSlider.js` — inside `handleSlideClick`: `track('gallery_open', { index })`
- `Header.js` — inside `selectLang`: `track('language_switch', { to: selectedLang.toLowerCase() })`

- [ ] **Step 8: Track trailer plays**

YouTube iframes give no play callback without the IFrame API, which is a heavier dependency than this needs. Track intent instead — the click that reaches the iframe — with an overlay-free approach in `VideoContent.js`:

```jsx
<div
  className="video-content__frame"
  onClick={() => track('trailer_play', { video: index === 0 ? 'pitch' : 'trailer' })}
>
```

This fires once per click on the player area. It measures interest, not completed views, and the event name should be read that way.

- [ ] **Step 9: Run the suite and verify in the browser**

Run: `CI=true npm test`
Expected: PASS, 10 tests.

In the browser, `@vercel/analytics` is inert on localhost by default. Confirm wiring instead by temporarily adding `console.log(event, props)` to the top of `track()`, clicking one store button, one social icon, one slide and one language, seeing four logs, then removing the log line.

- [ ] **Step 10: Commit**

```bash
git add -A
git commit -m "feat: add Vercel analytics and conversion events

Cookieless, no consent banner. Tracks CTA clicks, social clicks, gallery opens,
language switches and trailer play intent behind a wrapper that cannot throw."
```

---

## Task 7: Verify and ship to preview

**Files:**
- Modify: `README.md`
- Test: full manual pass

**Interfaces:**
- Consumes: everything above
- Produces: a deployed preview URL and a measured before/after

- [ ] **Step 1: Production build**

Run: `npm run build`
Expected: build succeeds with no errors. Note the reported bundle sizes.

- [ ] **Step 2: Measure the production build locally**

```bash
npx serve -s build -l 4000
```

Open http://localhost:4000, scroll to the bottom so the gallery loads, and run the Step 1 snippet from Task 1.
Expected: `totalMB` under 2, versus the 47.5 MB baseline.

- [ ] **Step 3: Full manual pass**

In both themes, at 1440px and 390px:

- Preloader appears and hands over quickly
- All images render — no broken icons, no empty gallery
- Language switches across EN / RU / UZ and survives a reload
- Gallery modal opens by mouse and by keyboard, Esc closes it
- Both trailers play
- Every social and store link opens the right destination in a new tab
- Nothing is low-contrast or clipped in either theme

- [ ] **Step 4: Update the README**

Add to `README.md`, after the dependencies section:

```markdown
## 🖼 Images

Source art lives in `art-source/` (outside `src/`, never bundled). Run
`npm run images` after changing it to regenerate the WebP derivatives and the
Open Graph share image that the components import.

## 🎨 Themes

Colour lives in `src/assets/styles/tokens.scss` as CSS custom properties, with a
dark override under `[data-theme="dark"]`. The theme is applied to `<html>`
before React mounts by an inline script in `public/index.html`.

## 📊 Analytics

`@vercel/analytics` (cookieless, no consent banner needed) plus Speed Insights.
Events go through `src/utils/analytics.js` — never import the vendor SDK
directly in a component.
```

- [ ] **Step 5: Push and open the preview**

```bash
git add -A
git commit -m "docs: document the image pipeline, themes and analytics"
git push -u origin feat/site-upgrade
```

Vercel builds a preview deployment for the branch automatically. Report the preview URL together with the before/after numbers.

- [ ] **Step 6: Hand off for sign-off**

Do not merge to `master`. Report: the preview URL, the measured before/after page weight, and screenshots of both themes at desktop and mobile widths.

---

## Self-Review

**Spec coverage:** 1.1 tokens → Task 2; 1.2 theme toggle → Task 2; 1.3 image pipeline → Task 1; 1.4 foundations → Task 4 (preloader, meta, manifest, favicon, language) and Task 5 (modal a11y, dead code); 1.5 analytics → Task 6; verification → Task 7. Phase 2 is deliberately absent. No gaps.

**Placeholders:** none. The two numbers deferred to measurement (generated image heights in Task 1 Steps 6 and 9, the measured page weight in commit messages) are explicitly labelled as read-from-output, not left blank for invention.

**Type consistency:** `SLIDER_SLIDES` items expose `{ id, src, srcSet, width, height }` in Task 1 and are consumed with exactly those names in Tasks 1 and 5. `useTheme()` returns `{ theme, toggleTheme }` in Task 2 and is destructured identically in `ThemeToggle`. `track(event, props)` is defined in Task 6 Step 4 and called with that signature in Steps 7 and 8. `closeModal` and `handleSlideClick(index, event)` in Task 5 match their call sites.
