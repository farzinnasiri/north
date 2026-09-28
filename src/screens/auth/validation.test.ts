import { validateAuth } from '@/screens/auth/validation';

describe('auth form validation', () => {
  it('requires a complete email and an eight-character password when creating an account', () => {
    expect(validateAuth('sign-up', { email: 'north@', password: 'short' })).toStrictEqual({
      email: 'Use a complete email address.',
      password: 'Use at least 8 characters.',
    });
  });

  it('does not apply sign-up password rules when returning to an existing account', () => {
    expect(validateAuth('sign-in', { email: 'man@north.app', password: 'old' })).toStrictEqual({});
  });
});
