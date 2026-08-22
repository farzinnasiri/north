export const SWAPS_PER_MONTH = 3;

/**
 * Swaps exist for an Action that genuinely does not fit his circumstances, and
 * the budget is what keeps "I do not feel like it" from spending one. It
 * refills on the calendar month rather than on a rolling window: a man should
 * be able to tell how many he has left without doing arithmetic.
 */
export function swapsLeft(usedAt: readonly number[], now: number): number {
  const month = new Date(now);
  const used = usedAt.filter((stamp) => {
    const when = new Date(stamp);
    return (
      when.getFullYear() === month.getFullYear() && when.getMonth() === month.getMonth()
    );
  });
  return Math.max(0, SWAPS_PER_MONTH - used.length);
}
