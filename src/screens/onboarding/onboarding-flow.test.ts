import {
  ONBOARDING_PROMPT_COUNT,
  ONBOARDING_STEPS,
  promptPositionFor,
} from '@/domains/onboarding/sequence';

describe('the 30-prompt onboarding sequence', () => {
  it('puts 24 Reality items, one reflection, and five preferences in the accepted order', () => {
    expect(ONBOARDING_PROMPT_COUNT).toBe(30);
    expect(ONBOARDING_STEPS.filter((step) => step.kind === 'question')).toHaveLength(24);
    expect(ONBOARDING_STEPS.filter((step) => step.kind === 'honest')).toHaveLength(1);
    expect(ONBOARDING_STEPS.filter((step) => step.kind === 'star-question')).toHaveLength(5);

    const kinds = ONBOARDING_STEPS.map((step) => step.kind);
    expect(ONBOARDING_STEPS.slice(0, 3)).toStrictEqual([
      { kind: 'welcome' },
      { field: 1, kind: 'profile' },
      { field: 2, kind: 'profile' },
    ]);
    expect(kinds.indexOf('honest')).toBeLessThan(kinds.indexOf('reality-reveal'));
    expect(kinds.indexOf('reality-reveal')).toBeLessThan(kinds.indexOf('north-star-intro'));
    expect(kinds.indexOf('north-star-intro')).toBeLessThan(kinds.indexOf('star-question'));
    expect(kinds.indexOf('letter')).toBeLessThan(kinds.indexOf('contract'));
    expect(kinds.indexOf('contract')).toBeLessThan(kinds.indexOf('first-action'));
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

  it('numbers only the 30 authored prompts across Reality, reflection, and preferences', () => {
    const prompts = ONBOARDING_STEPS
      .map((step) => promptPositionFor(step))
      .filter((position) => position !== null);

    expect(prompts).toHaveLength(30);
    expect(prompts[0]).toStrictEqual({ current: 1, total: 30 });
    expect(prompts[24]).toStrictEqual({ current: 25, total: 30 });
    expect(prompts[29]).toStrictEqual({ current: 30, total: 30 });
  });
});
