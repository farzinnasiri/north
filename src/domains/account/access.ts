type AccountAccess = {
  hasJourney: boolean;
  personalized: boolean;
  signedIn: boolean;
};

type AccountRedirect = '/' | '/onboarding' | '/personalize' | '/sign-up' | '/welcome';

/** The saved Journey remains local after logout, but its screens do not. */
export function redirectFromTabs(access: AccountAccess): AccountRedirect | null {
  if (!access.hasJourney || !access.signedIn) return '/welcome';
  return null;
}

/** Onboarding is completed before a first account can be created. */
export function redirectFromSignUp(access: AccountAccess): AccountRedirect | null {
  if (!access.hasJourney) return '/onboarding';
  if (access.signedIn) return '/';
  return null;
}

/** Signal selection follows account creation and is not a second Settings route. */
export function redirectFromPersonalization(access: AccountAccess): AccountRedirect | null {
  if (!access.hasJourney) return '/onboarding';
  if (!access.signedIn) return '/sign-up';
  if (access.personalized) return '/';
  return null;
}
