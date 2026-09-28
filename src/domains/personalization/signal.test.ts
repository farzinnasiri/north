import { NORTH_STAR_OPTIONS } from '@/domains/onboarding/onboarding';
import { SIGNAL_IDENTITIES, signalIdentity, suggestedSignal } from '@/domains/personalization/signal';

describe('signal identity suggestion', () => {
  it('uses the four authored signal names', () => {
    expect(SIGNAL_IDENTITIES.map((identity) => identity.label)).toStrictEqual([
      'Direct Red',
      'Quiet Gold',
      'Open Teal',
      'Electric Blue',
    ]);
  });

  it('gives every authored North Star one stable available signal', () => {
    const available = new Set(SIGNAL_IDENTITIES.map((identity) => identity.id));

    for (const star of NORTH_STAR_OPTIONS) {
      const first = suggestedSignal(star.value);
      expect(available.has(first)).toBe(true);
      expect(suggestedSignal(star.value)).toBe(first);
      expect(signalIdentity(first).id).toBe(first);
    }
  });
});
