
import { NumberTape } from '@/components/ui/number-tape';
import { NorthField } from '@/components/ui/north-field';
import type { Profile } from '@/domains/onboarding/onboarding';
import { OnboardingFrame } from '@/screens/onboarding/onboarding-frame';

type ProfileStepProps = {
  onChange: (profile: Profile) => void;
  onContinue: () => void;
  profile: Profile;
  step: 1 | 2;
};

export function ProfileStep({
  onChange,
  onContinue,
  profile,
  step,
}: ProfileStepProps) {
  if (step === 1) {
    return (
      <OnboardingFrame
        actionLabel="Continue"
        disabled={profile.name.trim().length === 0}
        onContinue={onContinue}
        title="What should I call you?"
      >
        <NorthField
          accessibilityLabel="Given name"
          autoCapitalize="words"
          autoComplete="given-name"
          autoFocus
          multiline={false}
          onChangeText={(name) => onChange({ ...profile, name })}
          placeholder=""
          returnKeyType="done"
          value={profile.name}
        />
      </OnboardingFrame>
    );
  }

  return (
    <OnboardingFrame
      actionLabel="Start"
      onContinue={onContinue}
      title={`How old are you, ${profile.name}?`}
    >
      <NumberTape
        accessibilityLabel="Age"
        maximum={60}
        minimum={16}
        onChange={(age) => onChange({ ...profile, age })}
        value={profile.age}
      />
    </OnboardingFrame>
  );
}
