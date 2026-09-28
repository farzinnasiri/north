import {
  redirectFromPersonalization,
  redirectFromSignUp,
  redirectFromTabs,
} from '@/domains/account/access';

describe('frontend account access', () => {
  it('keeps a signed-out person out of a saved journey until they sign in again', () => {
    expect(redirectFromTabs({ hasJourney: true, personalized: true, signedIn: false })).toBe('/welcome');
    expect(redirectFromTabs({ hasJourney: true, personalized: true, signedIn: true })).toBeNull();
  });

  it('does not offer account creation before onboarding is complete', () => {
    expect(redirectFromSignUp({ hasJourney: false, personalized: false, signedIn: false })).toBe('/onboarding');
    expect(redirectFromSignUp({ hasJourney: true, personalized: false, signedIn: false })).toBeNull();
  });

  it('offers Signal selection after sign-up without forcing it on a returning sign-in', () => {
    expect(redirectFromTabs({ hasJourney: true, personalized: false, signedIn: true })).toBeNull();
    expect(redirectFromSignUp({ hasJourney: true, personalized: false, signedIn: true })).toBe('/');
    expect(redirectFromPersonalization({ hasJourney: true, personalized: false, signedIn: false })).toBe('/sign-up');
    expect(redirectFromPersonalization({ hasJourney: true, personalized: true, signedIn: true })).toBe('/');
  });
});
