import { Redirect } from 'expo-router';

import { Home } from '@/screens/home';
import { useJourney } from '@/domains/journey/store';

export default function HomeRoute() {
  const journey = useJourney((state) => state.journey);

  // Onboarding is not a screen a man can wander into: either he has committed
  // and this is his home, or he has not and there is nothing here yet.
  if (!journey) {
    return <Redirect href="/onboarding" />;
  }

  return <Home />;
}
