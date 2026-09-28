const path = require('path');
const fs = require('fs');
const sharp = require('sharp');

const SRC = path.join(__dirname, '..', 'art-source');
const OUT = path.join(__dirname, '..', 'src', 'assets', 'image');
const PUBLIC = path.join(__dirname, '..', 'public');

// [source, output dir, output basename, widths, quality]
const JOBS = [
  ['background/screenshot1.png', 'background', 'screenshot1', [800, 1600], 80],
  ['background/screenshot2.png', 'background', 'screenshot2', [800, 1600], 80],
  ['background/screenshot3.png', 'background', 'screenshot3', [800, 1600], 80],
  ['background/screenshot4.png', 'background', 'screenshot4', [800, 1600], 80],
  ['background/screenshot5.png', 'background', 'screenshot5', [800, 1600], 80],
  ['background/bg1.png', 'background', 'bg1', [1600], 80],
  ['about/mage.png', 'about', 'mage', [900], 80],
  ['phone/iPhone1.png', 'phone', 'iPhone1', [1200], 80],
  ['phone/iPhoneBg.png', 'phone', 'iPhoneBg', [1200], 80],
  // Square crossed-swords lockup, ~854x904. Header renders it 64px tall
  // (~60px wide) -> 180w is a 3x source, so the small "HERO ARENA" lettering
  // stays crisp on high-DPI screens. Quality 90: the thin outlines smear at 80.
  ['logo/gameLogo.png', 'logo', 'gameLogo', [180], 90],
  ['logo/logo_str.png', 'logo', 'logo_str', [210], 80],
  // Hero roster portraits, hand-sliced from the game's icon atlas. Transparent
  // PNGs -> WebP keeps the alpha channel, unlike a JPEG fallback would.
  ['heroes/hero-1.png', 'heroes', 'hero-1', [256], 82],
  ['heroes/hero-2.png', 'heroes', 'hero-2', [256], 82],
  ['heroes/hero-3.png', 'heroes', 'hero-3', [256], 82],
  ['heroes/hero-4.png', 'heroes', 'hero-4', [256], 82],
];

async function run() {
  for (const [rel, dir, base, widths, quality] of JOBS) {
    const input = path.join(SRC, rel);
    const outDir = path.join(OUT, dir);
    fs.mkdirSync(outDir, { recursive: true });

    for (const width of widths) {
      // single-width assets keep a plain name; multi-width ones are suffixed
      const name = widths.length === 1 ? `${base}.webp` : `${base}-${width}.webp`;
      const out = path.join(outDir, name);
      const info = await sharp(input).resize({ width, withoutEnlargement: true })
        .webp({ quality }).toFile(out);
      console.log(`${name}  ${info.width}x${info.height}  ${(info.size / 1024).toFixed(0)} KB`);
    }
  }

  // Open Graph share image: 1200x630 centre crop of the key art
  const og = path.join(PUBLIC, 'og-image.jpg');
  const ogInfo = await sharp(path.join(SRC, 'background/bg1.png'))
    .resize({ width: 1200, height: 630, fit: 'cover', position: 'centre' })
    .jpeg({ quality: 82 }).toFile(og);
  console.log(`og-image.jpg  1200x630  ${(ogInfo.size / 1024).toFixed(0)} KB`);

  // PWA/apple-touch icons: the CRA scaffold logos (logo192/512.png) were never
  // replaced, so an installed shortcut read "Hero Arena" under React's atom.
  // gameLogo.png is now the near-square crossed-swords mark — a centred
  // contain-fit on the app's dark background keeps it legible at 192px
  // without squashing it the way the old wide wordmark would have needed.
  const logoSrc = path.join(SRC, 'logo/gameLogo.png');
  for (const size of [192, 512]) {
    const out = path.join(PUBLIC, `logo${size}.png`);
    const info = await sharp(logoSrc)
      .resize({ width: size, height: size, fit: 'contain', background: '#0c1016' })
      .flatten({ background: '#0c1016' })
      .png().toFile(out);
    console.log(`logo${size}.png  ${info.width}x${info.height}  ${(info.size / 1024).toFixed(0)} KB`);
  }
}

run().catch((err) => { console.error(err); process.exit(1); });
