import type { OpenAction } from '@/domains/actions/action';
import {
  DAY_MS,
  clampDeadline,
  daysOverdue,
  deadlineReadout,
  isOverdue,
} from '@/domains/actions/action';
import { SWAPS_PER_MONTH, swapsLeft } from '@/domains/actions/swaps';

const OPENED = Date.UTC(2026, 2, 1, 9, 0);

function action(deadlineDays: number): OpenAction {
  return {
    actionId: 'frame-say-it',
    axis: 'frame',
    deadlineDays,
    named: 'Speak up in Thursday’s meeting instead of nodding along.',
    note: null,
    openedAt: OPENED,
  };
}

describe('the open action', () => {
  it('is not overdue until the deadline has actually passed', () => {
    const open = action(3);

    expect(isOverdue(open, OPENED + 3 * DAY_MS)).toBe(false);
    expect(isOverdue(open, OPENED + 3 * DAY_MS + 1)).toBe(true);
  });

  it('reads out the time left, and drops hours past the second day', () => {
    const open = action(3);

    expect(deadlineReadout(open, OPENED + DAY_MS)).toBe('2d');
    expect(deadlineReadout(open, OPENED + DAY_MS + 20 * 60 * 60 * 1000)).toBe('1d 4h');
    expect(deadlineReadout(open, OPENED + 3 * DAY_MS - 4 * 60 * 60 * 1000)).toBe('4h');
    expect(deadlineReadout(open, OPENED + 3 * DAY_MS - 60 * 1000)).toBe('<1h');
  });

  it('counts whole days overdue, rounding down so the number never flatters', () => {
    const open = action(3);

    expect(daysOverdue(open, OPENED + 3 * DAY_MS)).toBe(0);
    expect(daysOverdue(open, OPENED + 11 * DAY_MS - 1)).toBe(7);
    expect(daysOverdue(open, OPENED + 11 * DAY_MS)).toBe(8);
  });

  it('holds the deadline inside one to seven days', () => {
    expect(clampDeadline(0)).toBe(1);
    expect(clampDeadline(4)).toBe(4);
    expect(clampDeadline(12)).toBe(7);
  });
});

describe('swaps', () => {
  it('gives three a month and spends them one at a time', () => {
    const march = Date.UTC(2026, 2, 14);

    expect(swapsLeft([], march)).toBe(SWAPS_PER_MONTH);
    expect(swapsLeft([Date.UTC(2026, 2, 2)], march)).toBe(2);
    expect(
      swapsLeft([Date.UTC(2026, 2, 2), Date.UTC(2026, 2, 8), Date.UTC(2026, 2, 9)], march),
    ).toBe(0);
  });

  it('does not spend this month on swaps used last month', () => {
    const march = Date.UTC(2026, 2, 1);
    const february = [Date.UTC(2026, 1, 2), Date.UTC(2026, 1, 8), Date.UTC(2026, 1, 9)];

    expect(swapsLeft(february, march)).toBe(SWAPS_PER_MONTH);
  });
});
