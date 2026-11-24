import { degreesForClose, directionAfter, earnedFor } from '@/domains/direction/movement';

describe('what a check-in is worth', () => {
  it('pays a full degree for an action done in the one day he gave it', () => {
    expect(earnedFor('done', 1)).toBe(1);
  });

  it('pays less for a longer promise, so padding the estimate never helps', () => {
    expect(degreesForClose(7)).toBe(0.7);
    expect(earnedFor('done', 7)).toBeLessThan(earnedFor('done', 1));
  });

  it('pays half for partly, and nothing for a miss', () => {
    expect(earnedFor('partly', 1)).toBe(0.5);
    expect(earnedFor('partly', 3)).toBe(0.45);
    expect(earnedFor('missed', 1)).toBe(0);
  });

  it('never moves the direction past north or backward', () => {
    expect(directionAfter(0.4, 1)).toBe(0);
    expect(directionAfter(23, 0)).toBe(23);
  });
});
