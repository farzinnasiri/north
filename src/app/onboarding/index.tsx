import { Redirect } from 'expo-router';

import { useJourney } from '@/domains/journey/store';
import { OnboardingFlow } from '@/screens/onboarding/onboarding-flow';

export default function OnboardingRoute() {
  const hasJourney = useJourney((state) => state.journey !== null);
  if (hasJourney) return <Redirect href="/" />;
  return <OnboardingFlow />;
}
