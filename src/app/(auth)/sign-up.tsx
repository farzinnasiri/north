import { Redirect } from 'expo-router';

import { redirectFromSignUp } from '@/domains/account/access';
import { useAccount } from '@/domains/account/store';
import { useJourney } from '@/domains/journey/store';
import { AuthForm } from '@/screens/auth/auth-form';

export default function SignUpRoute() {
  const journey = useJourney((state) => state.journey);
  const personalized = useAccount((state) => state.personalized);
  const signedIn = useAccount((state) => state.signedIn);
  const redirect = redirectFromSignUp({
    hasJourney: journey !== null,
    personalized,
    signedIn,
  });

  if (redirect) return <Redirect href={redirect} />;

  return <AuthForm mode="sign-up" />;
}
