// Draws North's brand mark to the PNG assets the platforms need.
//
// The mark is the compass reduced to what it is for, and it is generated
// rather than drawn by hand so the icon, the Android foreground, and the
// splash can never drift from `NorthMark` or from the palette in DESIGN.md.
//
//   node scripts/brand-assets.mjs
//
// Geometry is expressed in fractions of the canvas, so every size is the same
// drawing. Coverage is sampled 3x3 per pixel; at these sizes the cost is a
// second and the alternative is a visibly ragged needle.

import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const Jimp = require('jimp-compact');

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const theme = readFileSync(join(root, 'src', 'theme.ts'), 'utf8');

function token(name) {
  const match = theme.match(new RegExp(`${name}: '(#[0-9A-Fa-f]{6})'`));
  if (!match) throw new Error(`theme.ts has no colour named ${name}`);
  const hex = match[1];
  return [
    parseInt(hex.slice(1, 3), 16),
    parseInt(hex.slice(3, 5), 16),
    parseInt(hex.slice(5, 7), 16),
  ];
}

const FIELD_DEEP = token('fieldDeep');
const LINE = token('line');
const LINE_SOFT = token('lineSoft');
const BRASS = token('brass');
const ASH = token('ash');

const SAMPLES = 3;

/** Coverage of a ring of radius r and half-thickness t at distance d. */
function ring(d, r, t) {
  return Math.abs(d - r) <= t ? 1 : 0;
}

function normalizeAngle(degrees) {
  return ((degrees % 360) + 360) % 360;
}

function inArc(degrees, start, end) {
  const angle = normalizeAngle(degrees);
  const from = normalizeAngle(start);
  const to = normalizeAngle(end);
  return from <= to ? angle >= from && angle <= to : angle >= from || angle <= to;
}

/** Coverage of the triangle (needle) via barycentric containment. */
function triangle(px, py, ax, ay, bx, by, cx, cy) {
  const area = (bx - ax) * (cy - ay) - (cx - ax) * (by - ay);
  if (area === 0) return 0;
  const w0 = ((bx - px) * (cy - py) - (cx - px) * (by - py)) / area;
  const w1 = ((cx - px) * (ay - py) - (ax - px) * (cy - py)) / area;
  const w2 = 1 - w0 - w1;
  return w0 >= 0 && w1 >= 0 && w2 >= 0 ? 1 : 0;
}

function blend(target, colour, coverage) {
  if (coverage <= 0) return;
  const alpha = Math.min(1, coverage);
  target[0] = target[0] * (1 - alpha) + colour[0] * alpha;
  target[1] = target[1] * (1 - alpha) + colour[1] * alpha;
  target[2] = target[2] * (1 - alpha) + colour[2] * alpha;
  target[3] = Math.min(255, target[3] + 255 * alpha);
}

/**
 * @param size    canvas edge in pixels
 * @param scale   how much of the canvas the mark occupies (Android keeps a
 *                generous margin because the launcher masks the corners)
 * @param opaque  fill the canvas with field, or leave it transparent
 * @param weight  stroke multiplier; an app icon is read at 60pt and hairlines
 *                disappear there, so it carries a heavier line than the screen
 * @param signal  include the needle. The native splash omits it so the app can
 *                complete the same mark during its one-shot handoff.
 */
function draw(size, scale, opaque, weight = 1, signal = true) {
  const image = new Jimp(size, size, 0x00000000);
  const c = size / 2;
  const rim = size * 0.42 * scale;
  const inner = rim - size * 0.075 * scale;
  const needle = size * 0.3 * scale;
  const half = size * 0.028 * scale;
  const hub = size * 0.026 * scale;
  const stroke = Math.max(1, size * 0.004 * scale * weight);
  const step = 1 / SAMPLES;

  for (let y = 0; y < size; y += 1) {
    for (let x = 0; x < size; x += 1) {
      const pixel = opaque ? [...FIELD_DEEP, 255] : [0, 0, 0, 0];
      let rimHits = 0;
      let innerHits = 0;
      let northHits = 0;
      let southHits = 0;
      let hubHits = 0;
      let hubRingHits = 0;
      let hubSignalHits = 0;
      let cardinalHits = 0;

      for (let sy = 0; sy < SAMPLES; sy += 1) {
        for (let sx = 0; sx < SAMPLES; sx += 1) {
          const px = x + (sx + 0.5) * step;
          const py = y + (sy + 0.5) * step;
          const d = Math.hypot(px - c, py - c);
          const angle = (Math.atan2(py - c, px - c) * 180) / Math.PI;

          rimHits +=
            ring(d, rim, stroke) *
            (inArc(angle, -62, 62) || inArc(angle, 118, 242) ? 1 : 0);
          innerHits +=
            ring(d, inner, stroke) *
            (inArc(angle, -48, 48) || inArc(angle, 132, 228) ? 1 : 0);
          hubHits += d <= hub ? 1 : 0;
          hubRingHits += ring(d, hub, Math.max(1, stroke * 0.65));
          hubSignalHits += d <= hub * 0.38 ? 1 : 0;
          northHits += signal
            ? triangle(px, py, c, c - needle, c - half, c, c + half, c)
            : 0;
          southHits += signal
            ? triangle(px, py, c, c + needle * 0.34, c - half, c, c + half, c)
            : 0;
          cardinalHits +=
            Math.abs(px - c) <= stroke &&
            ((py >= c - rim - size * 0.02 * scale && py <= c - rim + size * 0.07 * scale) ||
              (py >= c + rim - size * 0.07 * scale && py <= c + rim + size * 0.02 * scale))
              ? 1
              : 0;
        }
      }

      const total = SAMPLES * SAMPLES;
      blend(pixel, LINE, rimHits / total);
      blend(pixel, LINE_SOFT, innerHits / total);
      blend(pixel, LINE, cardinalHits / total);
      blend(pixel, LINE, southHits / total);
      blend(pixel, BRASS, northHits / total);
      blend(pixel, opaque ? FIELD_DEEP : [15, 19, 25], hubHits / total);
      blend(pixel, ASH, hubRingHits / total);
      blend(pixel, BRASS, hubSignalHits / total);

      image.setPixelColor(
        Jimp.rgbaToInt(
          Math.round(pixel[0]),
          Math.round(pixel[1]),
          Math.round(pixel[2]),
          Math.round(pixel[3]),
        ),
        x,
        y,
      );
    }
  }

  return image;
}

const outputs = [
  { file: 'icon.png', opaque: true, scale: 1.06, signal: true, size: 1024, weight: 2.2 },
  { file: 'adaptive-icon.png', opaque: false, scale: 0.62, signal: true, size: 1024, weight: 2.2 },
  { file: 'splash-mark.png', opaque: false, scale: 1, signal: false, size: 512, weight: 1 },
];

for (const output of outputs) {
  const image = draw(output.size, output.scale, output.opaque, output.weight, output.signal);
  const buffer = await image.getBufferAsync(Jimp.MIME_PNG);
  writeFileSync(join(root, 'assets', output.file), buffer);
  console.log(`Wrote assets/${output.file} (${output.size}px)`);
}
