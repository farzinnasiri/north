import type { Line } from '@/domains/content/catalogue';
import { BUNDLED_CATALOGUE, isCatalogue } from '@/domains/content/catalogue';
import { suggestions } from '@/domains/content/selection';
import type { AxisReading } from '@/domains/direction/initial-direction';

function line(id: string, axis: Line['axis'], themes: Line['themes'] = []): Line {
  return { action: `Do ${id}`, axis, id, kind: 'quote', person: 'P', said: 'S', source: 'Src', takeaway: `Take ${id}`, themes, url: null };
}

const LINES: Line[] = [
  line('desire-1', 'desire'),
  line('desire-2', 'desire', ['money']),
  line('desire-3', 'desire'),
  line('connection-1', 'connection'),
  line('connection-2', 'connection', ['apology']),
  line('frame-1', 'frame'),
  line('craft-1', 'craft'),
  line('agency-1', 'agency'),
  line('appetite-1', 'appetite'),
];

const READINGS: AxisReading[] = [
  { axis: 'frame', off: 20 },
  { axis: 'desire', off: 90 },
  { axis: 'connection', off: 55 },
  { axis: 'appetite', off: 40 },
  { axis: 'craft', off: 30 },
  { axis: 'agency', off: 10 },
];

describe('today’s two suggestions', () => {
  it('come from the two axes he is furthest off on, in that order', () => {
    const picked = suggestions({ day: 1, lines: LINES, readings: READINGS, seen: [] });

    expect(picked.map((item) => item.axis)).toStrictEqual(['desire', 'connection']);
  });

  it('lead with lines that speak to what he said is costing him', () => {
    const picked = suggestions({ day: 1, honestThing: 'apology', lines: LINES, readings: READINGS, seen: [] });

    expect(picked[1].id).toBe('connection-2');
  });

  it('skip lines he has already taken or passed', () => {
    const picked = suggestions({
      day: 1, lines: LINES, readings: READINGS,
      seen: ['desire-1', 'desire-2', 'desire-3'],
    });

    expect(picked.map((item) => item.axis)).toStrictEqual(['connection', 'appetite']);
  });

  it('stay the same all day and change on another day', () => {
    const many = Array.from({ length: 30 }, (_, index) => line(`desire-${index}`, 'desire'));
    const monday = suggestions({ day: 100, lines: many, readings: READINGS, seen: [] });
    const again = suggestions({ day: 100, lines: many, readings: READINGS, seen: [] });
    const days = new Set(Array.from({ length: 7 }, (_, offset) =>
      suggestions({ day: 100 + offset, lines: many, readings: READINGS, seen: [] })[0].id));

    expect(again[0].id).toBe(monday[0].id);
    expect(days.size).toBeGreaterThan(1);
  });
});

describe('the catalogue', () => {
  it('ships a bundled copy the app accepts, so the first launch works offline', () => {
    expect(isCatalogue(BUNDLED_CATALOGUE)).toBe(true);
    expect(BUNDLED_CATALOGUE.lines.length).toBeGreaterThan(1000);
  });

  it('rejects a download with one malformed line rather than using part of it', () => {
    const broken = { lines: [...LINES, { ...LINES[0], axis: 'courage' }], version: 2 };

    expect(isCatalogue(broken)).toBe(false);
  });
});
