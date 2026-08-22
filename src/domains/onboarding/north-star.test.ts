import {
  ROLE_MODELS,
  axisTotals,
  deriveNorthStar,
  rankNorthStars,
} from '@/domains/onboarding/north-star';

describe('deriving the North Star', () => {
  it('lets a mans stated intent outweigh a single contrary role model', () => {
    // Two committed picks and one unattached, against an unattached intent.
    const star = deriveNorthStar({
      answers: {
        'boundaries-cost': 'positive',
        'boundaries-terms': 'positive',
        'power-regret': 'positive',
        'power-worth': 'positive',
        'relationships-hard': 'negative',
        'relationships-role': 'negative',
      },
      roleModels: ['superman', 'shelby', 'batman'],
    });

    expect(star).toBe('rogue');
  });

  it('follows the role models when intent is left unanswered on an axis', () => {
    const totals = axisTotals({
      answers: { 'power-regret': 'positive' },
      roleModels: ['iroh', 'obama', 'peter-parker'],
    });

    expect(totals.relationships).toBe(3);
    expect(totals.boundaries).toBe(-3);
  });

  it('sends the ambitious, committed and immovable man to the patriarch', () => {
    expect(
      deriveNorthStar({
        answers: {
          'boundaries-cost': 'positive',
          'boundaries-terms': 'positive',
          'power-regret': 'positive',
          'power-worth': 'positive',
          'relationships-hard': 'positive',
          'relationships-role': 'positive',
        },
        roleModels: ['superman', 'shelby', 'wick'],
      }),
    ).toBe('patriarch');
  });

  it('sends the satisfied, unattached and accommodating man to the playboy', () => {
    expect(
      deriveNorthStar({
        answers: {
          'boundaries-cost': 'negative',
          'boundaries-terms': 'negative',
          'power-regret': 'negative',
          'power-worth': 'negative',
          'relationships-hard': 'negative',
          'relationships-role': 'negative',
        },
        roleModels: ['belfort', 'stark', 'luffy'],
      }),
    ).toBe('playboy');
  });

  it('never lands an axis on zero, so a destination is always unambiguous', () => {
    // Three picks at +/-1 plus one answer at +/-2 is always odd.
    for (const first of ROLE_MODELS) {
      const totals = axisTotals({
        answers: {
          'boundaries-cost': 'positive',
          'boundaries-terms': 'positive',
          'power-regret': 'positive',
          'power-worth': 'positive',
          'relationships-hard': 'positive',
          'relationships-role': 'positive',
        },
        roleModels: [first.id, 'stark', 'iroh'],
      });

      expect(Math.abs(totals.power) % 2).toBe(1);
      expect(Math.abs(totals.relationships) % 2).toBe(1);
      expect(Math.abs(totals.boundaries) % 2).toBe(1);
    }
  });

  it('ranks the derived destination first and offers plausible neighbours', () => {
    const choices = {
      answers: {
        'boundaries-cost': 'positive',
        'boundaries-terms': 'positive',
        'power-regret': 'positive',
        'power-worth': 'positive',
        'relationships-hard': 'positive',
        'relationships-role': 'positive',
      } as const,
      roleModels: ['superman', 'shelby', 'wick'],
    };
    const ranked = rankNorthStars(choices);

    expect(ranked[0]).toBe(deriveNorthStar(choices));
    expect(ranked).toHaveLength(8);
    expect(new Set(ranked).size).toBe(8);
  });
});
