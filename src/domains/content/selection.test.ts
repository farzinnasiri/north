import type { AxisReading } from '@/domains/bearing/initial-bearing';
import { CATALOGUE } from '@/domains/content/catalogue';
import { nextAction } from '@/domains/content/selection';

const readings: AxisReading[] = [
  { axis: 'frame', off: 20 },
  { axis: 'desire', off: 90 },
  { axis: 'connection', off: 55 },
  { axis: 'appetite', off: 40 },
  { axis: 'craft', off: 30 },
  { axis: 'agency', off: 10 },
];

describe('choosing the next action', () => {
  it('proposes from the axis he is furthest off on', () => {
    const chosen = nextAction({ closed: [], passed: [], readings });

    expect(chosen.axis).toBe('desire');
  });

  it('gives the same action for the same inputs, every time', () => {
    const first = nextAction({ closed: [], passed: [], readings });
    const second = nextAction({ closed: [], passed: [], readings });

    expect(second.id).toBe(first.id);
  });

  it('does not propose an action he has already closed', () => {
    const closed = CATALOGUE.filter((action) => action.axis === 'desire').map((a) => a.id);
    const chosen = nextAction({ closed, passed: [], readings });

    expect(chosen.axis).toBe('connection');
  });

  it('does not propose an action he swapped away', () => {
    const first = nextAction({ closed: [], passed: [], readings });
    const second = nextAction({ closed: [], passed: [first.id], readings });

    expect(second.id).not.toBe(first.id);
    expect(second.axis).toBe('desire');
  });

  it('breaks a tie between axes the same way on every run', () => {
    const level: AxisReading[] = [
      { axis: 'frame', off: 50 },
      { axis: 'desire', off: 50 },
      { axis: 'connection', off: 50 },
      { axis: 'appetite', off: 50 },
      { axis: 'craft', off: 50 },
      { axis: 'agency', off: 50 },
    ];

    expect(nextAction({ closed: [], passed: [], readings: level }).axis).toBe('frame');
  });

  it('returns to the oldest closed action once the corpus is exhausted', () => {
    const closed = CATALOGUE.map((action) => action.id);
    const chosen = nextAction({ closed, passed: [], readings });

    expect(chosen.id).toBe(closed[0]);
  });
});
