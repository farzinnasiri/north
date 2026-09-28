import {
  HOLD_NORTH_DAYS,
  directionAfterClose,
  directionAfterMiss,
  daysHeldAtNorth,
  degreesForClose,
  hasExited,
} from '@/domains/direction/movement';
import { DAY_MS } from '@/domains/actions/action';

describe('direction movement', () => {
  it('pays one degree for an action closed on a one-day deadline', () => {
    expect(degreesForClose(1)).toBe(1);
  });

  it('charges five hundredths of a degree for each additional day of deadline', () => {
    expect(degreesForClose(2)).toBe(0.95);
    expect(degreesForClose(3)).toBe(0.9);
    expect(degreesForClose(4)).toBe(0.85);
    expect(degreesForClose(5)).toBe(0.8);
    expect(degreesForClose(6)).toBe(0.75);
    expect(degreesForClose(7)).toBe(0.7);
  });

  it('pays a sandbagged seven-day deadline less than an honest one-day deadline', () => {
    // The exploit the spec warns about: if finishing early paid more than the
    // estimate was worth, the optimal strategy would be to overestimate every
    // time. Closing early earns exactly what he committed to, and no more.
    expect(degreesForClose(7)).toBeLessThan(degreesForClose(1));
  });

  it('clamps a deadline outside one to seven days to what the product allows', () => {
    expect(degreesForClose(0)).toBe(1);
    expect(degreesForClose(90)).toBe(0.7);
  });

  it('moves the direction toward north by what the deadline was worth', () => {
    expect(directionAfterClose(47, 1)).toBe(46);
    expect(directionAfterClose(47, 7)).toBe(46.3);
  });

  it('never passes north, however much is earned', () => {
    expect(directionAfterClose(0.4, 1)).toBe(0);
  });

  it('leaves the direction exactly where it was when a deadline is missed', () => {
    expect(directionAfterMiss(47)).toBe(47);
    expect(directionAfterMiss(0)).toBe(0);
  });

  it('counts whole days held at north and exits on the thirtieth', () => {
    const reached = Date.UTC(2026, 0, 1);

    expect(daysHeldAtNorth(reached, reached + 29 * DAY_MS)).toBe(29);
    expect(hasExited(reached, reached + 29 * DAY_MS)).toBe(false);
    expect(hasExited(reached, reached + HOLD_NORTH_DAYS * DAY_MS)).toBe(true);
  });
});
