import { DAY_MS, checkInTime, dayLabel, isDue } from '@/domains/actions/action';

const NINE_PM = 21 * 60;

/** A local time on 2 March 2026, so the tests do not depend on the machine's time zone. */
function at(hours: number, minutes = 0, day = 2): number {
  return new Date(2026, 2, day, hours, minutes).getTime();
}

describe('the check-in time', () => {
  it('falls at his chosen time today when he gives himself one day', () => {
    expect(checkInTime(at(9), 1, NINE_PM)).toBe(at(21));
  });

  it('falls on the last of his days, not the first', () => {
    expect(checkInTime(at(9), 3, NINE_PM)).toBe(at(21, 0, 4));
  });

  it('moves to tomorrow when today’s check-in time has already passed', () => {
    expect(checkInTime(at(22, 30), 1, NINE_PM)).toBe(at(21, 0, 3));
  });

  it('is due from the check-in moment onward, not before', () => {
    const action = { checkInAt: at(21) };

    expect(isDue(action as never, at(20, 59))).toBe(false);
    expect(isDue(action as never, at(21))).toBe(true);
  });

  it('names the check-in day the way a person would say it', () => {
    expect(dayLabel(at(21), at(9))).toBe('Today');
    expect(dayLabel(at(21) + DAY_MS, at(9))).toBe('Tomorrow');
  });
});
