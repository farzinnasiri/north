import { Redirect } from 'expo-router';

import { redirectFromPersonalization } from '@/domains/account/access';
import { useAccount } from '@/domains/account/store';
import { useJourney } from '@/domains/journey/store';
import { Personalize } from '@/screens/auth/personalize';

export default function PersonalizeRoute() {
  const journey = useJourney((state) => state.journey);
  const personalized = useAccount((state) => state.personalized);
  const signedIn = useAccount((state) => state.signedIn);
  const redirect = redirectFromPersonalization({
    hasJourney: journey !== null,
    personalized,
    signedIn,
  });

  if (redirect) return <Redirect href={redirect} />;

  return <Personalize />;
}
