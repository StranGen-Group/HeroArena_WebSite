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
  ['logo/gameLogo.png', 'logo', 'gameLogo', [320], 80],
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
}

run().catch((err) => { console.error(err); process.exit(1); });
