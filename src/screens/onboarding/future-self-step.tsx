import { ChoiceInstrument } from '@/components/ui/choice-instrument';
import type { FutureHorizon } from '@/domains/onboarding/onboarding';
import { FUTURE_DOMAIN_OPTIONS, FUTURE_HORIZONS } from '@/domains/onboarding/onboarding';
import { OnboardingFrame } from '@/screens/onboarding/onboarding-frame';

type FutureSelfStepProps = {
  horizon: FutureHorizon;
  onChange: (values: string[]) => void;
  onContinue: () => void;
  value: readonly string[];
};

/**
 * Three horizons, the same neutral options each time. Multi-select with no
 * minimum and no maximum: one domain, all three, or "something else entirely"
 * are equally valid answers, and none is presented as the target. See
 * `FUTURE_DOMAIN_OPTIONS` in the domain module for why this is never scored.
 */
export function FutureSelfStep({
  horizon,
  onChange,
  onContinue,
  value,
}: FutureSelfStepProps) {
  const copy = FUTURE_HORIZONS.find((entry) => entry.horizon === horizon)!;

  return (
    <OnboardingFrame
      actionLabel="Continue"
      disabled={value.length === 0}
      kicker={copy.kicker}
      onContinue={onContinue}
      title={copy.title}
    >
      <ChoiceInstrument
        multiple
        onChange={onChange}
        options={FUTURE_DOMAIN_OPTIONS}
        presentation="chips"
        values={value}
      />
    </OnboardingFrame>
  );
}
