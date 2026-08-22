import { placeholderBearingRule } from '@/domains/bearing/initial-bearing';
import {
  FUTURE_DOMAIN_OPTIONS,
  FUTURE_HORIZONS,
  QUESTIONS,
  answerFor,
  getAxisReadings,
  getInitialBearing,
  scoreQuestion,
} from '@/domains/onboarding/onboarding';

function question(id: string) {
  const match = QUESTIONS.find((item) => item.id === id);
  if (!match) throw new Error(`Unknown question ${id}`);
  return match;
}

describe('onboarding readings', () => {
  it('averages the four literal readings within each Axis', () => {
    const frame = QUESTIONS.filter((question) => question.axis === 'frame');
    const answers = Object.fromEntries(
      [0, 20, 40, 100].map((off, index) => {
        const answer = answerFor(frame[index], index, off);
        return [answer.id, answer];
      }),
    );

    expect(getAxisReadings(answers)[0]).toStrictEqual({ axis: 'frame', off: 40 });
  });

  it('keeps the unsettled Bearing rule behind one replaceable seam', () => {
    const answers = Object.fromEntries(
      QUESTIONS.map((question) => {
        const answer = answerFor(question, 'answer', 50);
        return [answer.id, answer];
      }),
    );

    expect(getInitialBearing(answers, placeholderBearingRule)).toBe(90);
  });

  it('scores Frame from the settled literal readings', () => {
    expect([0, 1, 2, 3, 4].map((value) => scoreQuestion(question('F1'), value))).toStrictEqual([
      0, 20, 45, 75, 100,
    ]);
    expect(scoreQuestion(question('F2'), { choice: 'say-it' })).toBe(10);
    expect(scoreQuestion(question('F2'), { choice: 'let-it-go' })).toBe(90);
    expect([0, 3, 9].map((value) => scoreQuestion(question('F3'), value))).toStrictEqual([
      0, 36, 100,
    ]);
    expect([0, 100].map((value) => scoreQuestion(question('F4'), value))).toStrictEqual([
      100, 0,
    ]);
  });

  it('scores Desire from the settled literal readings', () => {
    expect([0, 1, 2, 3, 4].map((value) => scoreQuestion(question('D1'), value))).toStrictEqual([
      0, 25, 55, 80, 100,
    ]);
    expect([0, 4, 11].map((value) => scoreQuestion(question('D2'), value))).toStrictEqual([
      0, 40, 100,
    ]);
    expect([0, 100].map((value) => scoreQuestion(question('D3'), value))).toStrictEqual([
      100, 0,
    ]);
    expect([0, 1, 2, 3, 4, 5].map((value) => scoreQuestion(question('D4'), value))).toStrictEqual([
      40, 55, 60, 85, 90, 75,
    ]);
  });

  it('scores Connection from the settled literal readings', () => {
    // "Honestly, nobody" is the furthest-off reading regardless of anything else.
    expect(scoreQuestion(question('C1'), ['nobody'])).toBe(100);
    expect(scoreQuestion(question('C1'), ['friend', 'sibling'])).toBe(60);
    expect(
      scoreQuestion(question('C1'), ['friend', 'sibling', 'parent', 'partner', 'colleague']),
    ).toBe(0);
    expect([0, 1, 2, 3, 4].map((value) => scoreQuestion(question('C2'), value))).toStrictEqual([
      0, 30, 60, 85, 100,
    ]);
    expect([0, 4, 8].map((value) => scoreQuestion(question('C3'), value))).toStrictEqual([
      100, 44, 0,
    ]);
    expect(scoreQuestion(question('C4'), { choice: 'someone', name: 'Sam' })).toBe(15);
    expect(scoreQuestion(question('C4'), { choice: 'nobody' })).toBe(95);
  });

  it('scores Appetite from the settled literal readings', () => {
    expect([0, 4, 8, 24].map((value) => scoreQuestion(question('A1'), value))).toStrictEqual([
      0, 50, 100, 100,
    ]);
    // The gym and "nothing" are free; everything else adds twenty.
    expect(scoreQuestion(question('A2'), ['gym'])).toBe(20);
    expect(scoreQuestion(question('A2'), ['phone', 'games', 'gym'])).toBe(60);
    // Paying for attention: none is free, each paid channel adds thirty.
    expect(scoreQuestion(question('A5'), ['none'])).toBe(10);
    expect(scoreQuestion(question('A5'), ['dating', 'onlyfans'])).toBe(70);
    expect([0, 1, 2, 3, 4].map((value) => scoreQuestion(question('A3'), value))).toStrictEqual([
      100, 75, 50, 25, 0,
    ]);
    expect([5, 92.5, 180, 300].map((value) => scoreQuestion(question('A4'), value))).toStrictEqual([
      0, 50, 100, 100,
    ]);
  });

  it('scores Craft from the settled literal readings', () => {
    expect([0, 2, 4, 8].map((value) => scoreQuestion(question('K1'), value))).toStrictEqual([
      100, 50, 0, 0,
    ]);
    expect([0, 1, 2, 3, 4].map((value) => scoreQuestion(question('K2'), value))).toStrictEqual([
      0, 25, 55, 80, 100,
    ]);
    expect([0, 100].map((value) => scoreQuestion(question('K3'), value))).toStrictEqual([
      100, 0,
    ]);
    expect(scoreQuestion(question('K4'), [
      'Your screen', 'Your body', 'Your work', 'Your skills', 'Your friends',
    ])).toBe(100);
    expect(scoreQuestion(question('K4'), [
      'Your body', 'Your work', 'Your skills', 'Your friends', 'Your screen',
    ])).toBe(0);
  });

  it('reads unspoken interest and being unmissed as the newer failures', () => {
    // Every woman he is close to and has said nothing to costs twenty-five.
    expect(scoreQuestion(question('D5'), 0)).toBe(0);
    expect(scoreQuestion(question('D5'), 2)).toBe(50);
    expect(scoreQuestion(question('D5'), 8)).toBe(100);

    // Nobody noticing a week of silence is the furthest-off reading.
    expect(scoreQuestion(question('C5'), 0)).toBe(100);
    expect(scoreQuestion(question('C5'), 5)).toBe(0);
  });

  it('scores measuring yourself against strangers as further off than against your past self', () => {
    const against = (index: number) => scoreQuestion(question('K5'), index);

    expect(against(0)).toBeLessThan(against(3));
    expect(against(3)).toBe(95);
  });

  it('reads a man who cannot picture his future self as the furthest off', () => {
    // Hershfield: continuity, not which future he would pick. Every future-self
    // question scores the same way, so the trio measures one construct.
    for (const id of ['G6', 'G7', 'G8']) {
      expect(scoreQuestion(question(id), ['blank'])).toBe(100);
      expect(scoreQuestion(question(id), [])).toBe(100);
    }

    expect(scoreQuestion(question('G6'), ['building'])).toBe(15);
    expect(scoreQuestion(question('G7'), ['one', 'few'])).toBe(15);
    expect(scoreQuestion(question('G8'), ['stronger'])).toBe(15);
  });

  it('scores an external locus of control as further off than an internal one', () => {
    const luck = (index: number) => scoreQuestion(question('G2'), index);

    expect(luck(0)).toBe(95);
    expect(luck(2)).toBe(10);
    expect(luck(0)).toBeGreaterThan(luck(1));
    expect(luck(1)).toBeGreaterThan(luck(2));
  });

  it('treats confidence as earned rather than innate', () => {
    // Bandura: mastery experiences are the primary source, which is what a
    // closed action is. Believing it is innate is the off-course reading.
    expect(scoreQuestion(question('G3'), { choice: 'earned' })).toBe(10);
    expect(scoreQuestion(question('G3'), { choice: 'innate' })).toBe(85);
  });

  it('gives every axis at least five readings', () => {
    const axes = ['agency', 'appetite', 'connection', 'craft', 'desire', 'frame'] as const;

    for (const axis of axes) {
      expect(QUESTIONS.filter((entry) => entry.axis === axis).length).toBeGreaterThanOrEqual(5);
    }
  });
});

describe('the future-self domains', () => {
  it('carries no scoring metadata, so no domain or combination can be rewarded', () => {
    // If someone later adds an `off` field to sneak scoring in, this fails —
    // that is the point: this question must stay structurally unscoreable.
    for (const option of FUTURE_DOMAIN_OPTIONS) {
      expect(Object.keys(option).sort()).toStrictEqual(['label', 'value']);
    }
  });

  it('never appears in the scored question set', () => {
    const futureSelfIds = FUTURE_DOMAIN_OPTIONS.map((option) => option.value);
    const questionIds = QUESTIONS.map((entry) => entry.id);

    for (const id of futureSelfIds) {
      expect(questionIds).not.toContain(id);
    }
  });

  it('offers three distinct horizons, each with its own prompt', () => {
    expect(FUTURE_HORIZONS.map((entry) => entry.horizon)).toStrictEqual(['near', 'mid', 'far']);
    expect(new Set(FUTURE_HORIZONS.map((entry) => entry.title)).size).toBe(3);
  });

  it('offers the same neutral domains at every horizon, intellectual and adventurous and physical alike', () => {
    expect(FUTURE_DOMAIN_OPTIONS.map((option) => option.value)).toStrictEqual([
      'intellectual',
      'adventurous',
      'physical',
      'other',
    ]);
  });
});
