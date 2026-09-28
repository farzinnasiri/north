export type AuthMode = 'sign-in' | 'sign-up';

export type AuthValues = {
  email: string;
  password: string;
};

export type AuthErrors = Partial<Record<keyof AuthValues, string>>;

const COMPLETE_EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateAuth(mode: AuthMode, values: AuthValues): AuthErrors {
  const errors: AuthErrors = {};
  const email = values.email.trim();

  if (email.length === 0) {
    errors.email = 'Enter your email address.';
  } else if (!COMPLETE_EMAIL.test(email)) {
    errors.email = 'Use a complete email address.';
  }

  if (values.password.length === 0) {
    errors.password = 'Enter your password.';
  } else if (mode === 'sign-up' && values.password.length < 8) {
    errors.password = 'Use at least 8 characters.';
  }

  return errors;
}
