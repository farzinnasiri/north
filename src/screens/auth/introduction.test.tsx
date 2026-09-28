import { fireEvent, render, screen } from '@testing-library/react-native';
import type { ReactElement } from 'react';

import { Introduction } from '@/screens/auth/introduction';

jest.mock('expo-router', () => {
  const { cloneElement } = jest.requireActual<typeof import('react')>('react');
  return {
    Link: ({ children, href }: {
      children: ReactElement<{ accessibilityHint?: string }>;
      href: string;
    }) => cloneElement(children, { accessibilityHint: href }),
  };
});

jest.mock('@/components/ui/reveal', () => ({
  Reveal: ({ children }: { children: React.ReactNode }) => children,
}));

jest.mock('@/domains/mascot/ui/mascot', () => ({
  Mascot: () => null,
}));

describe('Introduction', () => {
  it('tells the problem, process, and change story in six short steps', async () => {
    await render(<Introduction />);

    expect(screen.getByText('Recognize this?')).toBeOnTheScreen();
    expect(screen.getByText('I like you.', { includeHiddenElements: true })).toBeOnTheScreen();
    expect(screen.getByText("You're such a good friend.", { includeHiddenElements: true })).toBeOnTheScreen();
    expect(screen.getByText("I just don't see you that way.", { includeHiddenElements: true })).toBeOnTheScreen();
    expect(screen.getByText('01 / 06')).toBeOnTheScreen();

    await fireEvent.press(screen.getByRole('button', { name: 'Show next introduction step' }));
    expect(
      screen.getByText('Everyone has an opinion about the man you should be.'),
    ).toBeOnTheScreen();
    expect(screen.getByText('02 / 06')).toBeOnTheScreen();

    await fireEvent.press(screen.getByRole('button', { name: 'Show next introduction step' }));
    expect(screen.getByText('You still decide who you become.')).toBeOnTheScreen();
    expect(
      screen.getByText('YOURS TO WRITE', { includeHiddenElements: true }),
    ).toBeOnTheScreen();

    await fireEvent.press(screen.getByRole('button', { name: 'Show next introduction step' }));
    expect(
      screen.getByText('North gives you one Action. You decide what it means for you.'),
    ).toBeOnTheScreen();

    await fireEvent.press(screen.getByRole('button', { name: 'Show next introduction step' }));
    expect(
      screen.getByText("Close it when it's done, then take the next one."),
    ).toBeOnTheScreen();

    await fireEvent.press(screen.getByRole('button', { name: 'Show next introduction step' }));
    expect(
      screen.getByText('After 30 Actions, look at what changed.'),
    ).toBeOnTheScreen();
    expect(
      screen.getByText('ACTION 30', { includeHiddenElements: true }),
    ).toBeOnTheScreen();
    expect(screen.getByText('DONE', { includeHiddenElements: true })).toBeOnTheScreen();
    expect(
      screen.queryByText('(1 + ε)¹⁰⁰', { includeHiddenElements: true }),
    ).not.toBeOnTheScreen();
    expect(screen.getByText('06 / 06')).toBeOnTheScreen();
    expect(screen.getByRole('button', { name: 'Show next introduction step' })).toBeDisabled();
  });

  it('keeps story controls separate from starting onboarding', async () => {
    await render(<Introduction />);

    expect(screen.getByRole('button', { name: 'Show previous introduction step' })).toBeDisabled();
    expect(screen.getByRole('button', { name: 'Back' })).toHaveProp(
      'accessibilityHint',
      '/welcome',
    );
    expect(screen.getByRole('button', { name: 'Start' })).toHaveProp(
      'accessibilityHint',
      '/onboarding',
    );

    await fireEvent.press(screen.getByRole('button', { name: 'Show next introduction step' }));
    await fireEvent.press(screen.getByRole('button', { name: 'Show previous introduction step' }));
    expect(screen.getByText('Recognize this?')).toBeOnTheScreen();
  });
});
