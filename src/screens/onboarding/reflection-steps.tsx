import { ChoiceInstrument } from '@/components/ui/choice-instrument';
import { AVOIDED_OPTIONS } from '@/domains/onboarding/onboarding';
import { OnboardingFrame } from '@/screens/onboarding/onboarding-frame';

type HonestThingStepProps = {
  onChange: (value: string) => void;
  onContinue: () => void;
  value: string;
};

export function HonestThingStep({
  onChange,
  onContinue,
  value,
}: HonestThingStepProps) {
  return (
    <OnboardingFrame
      actionLabel="Keep this"
      disabled={value.length === 0}
      onContinue={onContinue}
      title="Which one is costing you most right now?"
    >
      <ChoiceInstrument
        onChange={(values) => onChange(values[0])}
        options={AVOIDED_OPTIONS.map((option) => ({ label: option.label, value: option.value }))}
        values={value ? [value] : []}
      />
    </OnboardingFrame>
  );
}
