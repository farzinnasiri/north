import { OnboardingFrame } from '@/screens/onboarding/onboarding-frame';

type WelcomeProps = {
  onContinue: () => void;
};

export function Welcome({ onContinue }: WelcomeProps) {
  return (
    <OnboardingFrame
      actionLabel="Start"
      align="centre"
      body="30 questions. About 10 minutes. Answer based on what you actually did."
      onContinue={onContinue}
      presentation="statement"
      title="Hi. I'm North."
    />
  );
}
