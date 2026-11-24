import type { Line, Theme } from '@/domains/content/catalogue';
import type { Axis, AxisReading } from '@/domains/direction/initial-direction';
import type { NorthStarType } from '@/domains/onboarding/onboarding';
import { directionWeightsForNorthStar } from '@/domains/onboarding/north-star';

/**
 * Fixed order for ties, so two Axes that read the same resolve the same way on
 * every phone.
 */
const AXIS_ORDER: readonly Axis[] = ['frame', 'desire', 'connection', 'appetite', 'craft', 'agency'];

/** The onboarding answer for "what is costing you most", mapped to a Theme. */
const HONEST_THEMES: Readonly<Record<string, Theme>> = {
  apology: 'apology',
  body: 'body',
  conversation: 'conversation',
  habit: 'habit',
  money: 'money',
  unstarted: 'unstarted',
};

export function themeForHonestThing(value: string): Theme | null {
  return HONEST_THEMES[value] ?? null;
}

type SuggestionInput = {
  /** Local day number. Suggestions change once a day, not on every render. */
  day: number;
  honestThing?: string;
  lines: readonly Line[];
  northStar?: NorthStarType | null;
  readings: readonly AxisReading[];
  /** Line ids already taken or passed over. */
  seen: readonly string[];
};

/**
 * Today's two suggestions. The first comes from the Axis he is furthest off
 * on, weighted by the North Star he chose; the second from the next Axis, so
 * the choice is between two different kinds of move rather than two versions
 * of one. Inside an Axis, lines that speak to what he said is costing him come
 * first, and the rest rotate by day.
 *
 * Same inputs, same suggestions: there is no randomness, which keeps this
 * testable and keeps the screen from reshuffling when it re-renders.
 */
export function suggestions({
  day,
  honestThing = '',
  lines,
  northStar = null,
  readings,
  seen,
}: SuggestionInput): Line[] {
  const theme = themeForHonestThing(honestThing);
  const used = new Set(seen);
  const fresh = lines.filter((line) => !used.has(line.id));
  // Everything seen: start the catalogue over rather than show nothing.
  const pool = fresh.length >= 2 ? fresh : lines;

  const picked: Line[] = [];
  for (const axis of axesWorstFirst(readings, northStar)) {
    const best = pool
      .filter((line) => line.axis === axis)
      .sort((left, right) => rank(left, right, theme, day))[0];
    if (best) picked.push(best);
    if (picked.length === 2) return picked;
  }
  return picked;
}

export function axesWorstFirst(
  readings: readonly AxisReading[],
  northStar: NorthStarType | null,
): Axis[] {
  const weights = northStar ? directionWeightsForNorthStar(northStar) : null;
  return [...AXIS_ORDER].sort((left, right) => {
    const difference = gap(readings, right) * (weights?.[right] ?? 1)
      - gap(readings, left) * (weights?.[left] ?? 1);
    return difference !== 0 ? difference : AXIS_ORDER.indexOf(left) - AXIS_ORDER.indexOf(right);
  });
}

function rank(left: Line, right: Line, theme: Theme | null, day: number): number {
  if (theme) {
    const leftHas = left.themes.includes(theme) ? 0 : 1;
    const rightHas = right.themes.includes(theme) ? 0 : 1;
    if (leftHas !== rightHas) return leftHas - rightHas;
  }
  return shuffled(left.id, day) - shuffled(right.id, day) || (left.id < right.id ? -1 : 1);
}

function gap(readings: readonly AxisReading[], axis: Axis): number {
  return readings.find((reading) => reading.axis === axis)?.off ?? 0;
}

/** A stable per-day position for a line: the same all day, different tomorrow. */
function shuffled(id: string, day: number): number {
  return avalanche(hash(id) ^ Math.imul(day, 0x9e3779b1));
}

/** Murmur3's finaliser, so a one-day change reorders the whole list. */
function avalanche(value: number): number {
  let result = value >>> 0;
  result = Math.imul(result ^ (result >>> 16), 0x85ebca6b) >>> 0;
  result = Math.imul(result ^ (result >>> 13), 0xc2b2ae35) >>> 0;
  return (result ^ (result >>> 16)) >>> 0;
}

/** FNV-1a. Small, fast, and identical on every JavaScript engine. */
function hash(value: string): number {
  let result = 0x811c9dc5;
  for (let index = 0; index < value.length; index += 1) {
    result ^= value.charCodeAt(index);
    result = Math.imul(result, 0x01000193) >>> 0;
  }
  return result;
}
