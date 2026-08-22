import { OnboardingFrame } from '@/screens/onboarding/onboarding-frame';

type WelcomeProps = {
  onContinue: () => void;
};

export function Welcome({ onContinue }: WelcomeProps) {
  return (
    <OnboardingFrame
      actionLabel="Nice to meet you"
      body="Give me a few honest answers. I will help you see where you are, choose who you are walking toward, and set your first bearing."
      onContinue={onContinue}
      presentation="statement"
      title="Hi. I am North."
    />
  );
}

export function WelcomePromise({ onContinue }: WelcomeProps) {
  return (
    <OnboardingFrame
      actionLabel="I am ready"
      body="This takes about sixteen minutes. It is the longest I will ever ask for."
      onContinue={onContinue}
      presentation="statement"
      title="When we are done, you will not need me."
    />
  );
}
