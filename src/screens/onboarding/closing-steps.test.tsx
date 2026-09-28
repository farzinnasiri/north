import { render, screen } from '@testing-library/react-native';

import { CATALOGUE } from '@/domains/content/catalogue';
import { TheCode } from '@/domains/journey/ui/the-code';
import { FirstActionStep, LetterStep } from '@/screens/onboarding/closing-steps';

jest.mock('expo-audio', () => ({
  useAudioPlayer: () => ({ play: jest.fn() }),
}));

describe('the closing copy', () => {
  it('makes room for help and a miss without shame', async () => {
    await render(<TheCode />);

    expect(screen.getByText(/Ask for help when you need it/)).toBeOnTheScreen();
    expect(screen.queryByText(/bleed quietly/i)).not.toBeOnTheScreen();
    expect(screen.queryByText(/don't cry/i)).not.toBeOnTheScreen();
  });

  it('does not use unsupported conversion or retention claims', async () => {
    await render(
      <LetterStep onContinue={jest.fn()} />,
    );

    expect(screen.getByTestId('onboarding-statement-stage')).toBeOnTheScreen();
    expect(screen.getByText(/Nothing moves backward/)).toBeOnTheScreen();
    expect(screen.getByRole('button', { name: 'Read the agreement' })).toBeOnTheScreen();
    expect(screen.queryByText(/45%|forty-five percent/i)).not.toBeOnTheScreen();
    expect(screen.queryByText(/day twelve/i)).not.toBeOnTheScreen();
  });

  it('shows the first personalized Action before account creation', async () => {
    await render(
      <FirstActionStep
        action={CATALOGUE[0]}
        northStar="The Patriarch"
        onContinue={jest.fn()}
        reflectionLed
      />,
    );

    expect(screen.getByText('NORTH STAR · THE PATRIARCH')).toBeOnTheScreen();
    expect(screen.getByText('START HERE · FRAME')).toBeOnTheScreen();
    expect(screen.getByText(CATALOGUE[0].title)).toBeOnTheScreen();
    expect(screen.getByText('This starts with what you said is costing you most.')).toBeOnTheScreen();
    expect(screen.getByRole('button', { name: 'Create your account' })).toBeOnTheScreen();
  });
});
