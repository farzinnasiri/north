import { render, screen } from '@testing-library/react-native';
import type { ReactElement } from 'react';

import { Welcome } from '@/screens/auth/welcome';

jest.mock('expo-router', () => {
  const { cloneElement } = jest.requireActual<typeof import('react')>('react');
  return {
    Link: ({ children, href }: {
      children: ReactElement<{ accessibilityHint?: string }>;
      href: string;
    }) => cloneElement(children, { accessibilityHint: href }),
  };
});

jest.mock('@/domains/mascot/ui/mascot', () => ({
  Mascot: () => null,
}));

describe('Welcome', () => {
  it('explains what North does in one sentence', async () => {
    await render(<Welcome />);

    expect(
      screen.getByText(
        'North gives you one Action at a time and asks you to set the deadline.',
      ),
    ).toBeOnTheScreen();
    expect(screen.queryByText('YOU ARE HERE')).not.toBeOnTheScreen();
    expect(screen.queryByText('One Action at a time.')).not.toBeOnTheScreen();
  });

  it('keeps both paths visible and concise', async () => {
    await render(<Welcome />);

    expect(screen.getByRole('button', { name: 'See how it works' })).toHaveProp(
      'accessibilityHint',
      '/introduction',
    );
    expect(screen.getByText('Already have an account?')).toBeOnTheScreen();
    expect(screen.getByRole('link', { name: 'SIGN IN' })).toHaveProp(
      'accessibilityHint',
      '/sign-in',
    );
  });
});
