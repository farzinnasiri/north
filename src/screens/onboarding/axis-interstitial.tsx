import type { Axis } from '@/domains/bearing/initial-bearing';
import { OnboardingFrame } from '@/screens/onboarding/onboarding-frame';

type AxisInterstitialProps = {
  axis: Axis;
  onContinue: () => void;
};

/**
 * A chapter break. Thirty-five questions in a row is a conveyor belt; six
 * movements is a piece of work with a shape. Each one names the condition
 * before asking about it, so the questions land as recognition rather than
 * assessment.
 *
 * It runs through the same chassis as every question, so North and the copy sit
 * exactly where they always sit.
 */
const AXIS_COPY: Record<Axis, { line: string; name: string }> = {
  agency: {
    line: 'Whether any of this is yours to decide. Nothing else on this list moves until that one does.',
    name: 'AGENCY',
  },
  appetite: {
    line: 'Everything built in the last ten years was designed to hold you longer than you meant to stay.',
    name: 'APPETITE',
  },
  connection: {
    line: 'Men your age have fewer close friends than any generation on record. It is not a flaw in you. It is still yours to fix.',
    name: 'CONNECTION',
  },
  craft: {
    line: 'What you can do, and what you have made of your body. The two things nobody can take off you.',
    name: 'CRAFT',
  },
  desire: {
    line: 'The rules for wanting things changed, and nobody handed you the new ones. That part is not your fault. What you do about it is.',
    name: 'DESIRE',
  },
  frame: {
    line: 'Most men know exactly what they think. Far fewer say it while it still costs something.',
    name: 'FRAME',
  },
};

export function AxisInterstitial({ axis, onContinue }: AxisInterstitialProps) {
  const copy = AXIS_COPY[axis];

  return (
    <OnboardingFrame
      actionLabel="Begin"
      kicker={copy.name}
      onContinue={onContinue}
      presentation="statement"
      title={copy.line}
    />
  );
}
