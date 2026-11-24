import {
  ONBOARDING_PROMPT_COUNT,
  ONBOARDING_STEPS,
  promptPositionFor,
} from '@/domains/onboarding/sequence';

describe('the 15-prompt onboarding sequence', () => {
  it('puts 12 Reality items, one reflection, and two preferences in the accepted order', () => {
    expect(ONBOARDING_PROMPT_COUNT).toBe(15);
    expect(ONBOARDING_STEPS.filter((step) => step.kind === 'question')).toHaveLength(12);
    expect(ONBOARDING_STEPS.filter((step) => step.kind === 'honest')).toHaveLength(1);
    expect(ONBOARDING_STEPS.filter((step) => step.kind === 'star-question')).toHaveLength(2);

    const kinds = ONBOARDING_STEPS.map((step) => step.kind);
    expect(ONBOARDING_STEPS.slice(0, 3)).toStrictEqual([
      { field: 1, kind: 'profile' },
      { kind: 'welcome' },
      { field: 2, kind: 'profile' },
    ]);
    expect(kinds.indexOf('honest')).toBeLessThan(kinds.indexOf('reality-reveal'));
    expect(kinds.indexOf('reality-reveal')).toBeLessThan(kinds.indexOf('star-question'));
    expect(kinds.indexOf('contract')).toBeLessThan(kinds.indexOf('first-action'));
    expect(kinds.at(-1)).toBe('check-in');
    expect(kinds).not.toContain('letter');
    expect(kinds).not.toContain('north-star-intro');
    expect(kinds.filter((kind) => kind === 'profile')).toHaveLength(2);
    expect(kinds).not.toContain('interstitial');
    expect(kinds).not.toContain('promise');
    expect(kinds).not.toContain('alter-ego');
    expect(kinds).not.toContain('role-models');
    expect(kinds).not.toContain('future-self');
    expect(kinds).not.toContain('payoff');
    expect(kinds).not.toContain('payoff-cost');
    expect(kinds).not.toContain('alter-ego-intro');
    expect(kinds).not.toContain('direction-loading');
    expect(kinds).not.toContain('reading');
    expect(kinds).not.toContain('code-intro');
    expect(kinds).not.toContain('code');

    const afterReality = kinds.slice(kinds.indexOf('reality-reveal') + 1);
    expect(afterReality.length).toBeLessThanOrEqual(12);
  });

  it('numbers only the 15 authored prompts across Reality, reflection, and preferences', () => {
    const prompts = ONBOARDING_STEPS
      .map((step) => promptPositionFor(step))
      .filter((position) => position !== null);

    expect(prompts).toHaveLength(15);
    expect(prompts[0]).toStrictEqual({ current: 1, total: 15 });
    expect(prompts[12]).toStrictEqual({ current: 13, total: 15 });
    expect(prompts[14]).toStrictEqual({ current: 15, total: 15 });
  });
});
