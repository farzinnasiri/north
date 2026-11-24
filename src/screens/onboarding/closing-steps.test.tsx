import { fireEvent, render, screen } from '@testing-library/react-native';

import { BUNDLED_CATALOGUE } from '@/domains/content/catalogue';
import { TheCode } from '@/domains/journey/ui/the-code';
import { CheckInStep, FirstActionStep } from '@/screens/onboarding/closing-steps';

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

  it('offers two first actions with their sources and starts with the chosen one', async () => {
    const lines = BUNDLED_CATALOGUE.lines.slice(0, 2);
    const onChoose = jest.fn();
    const onContinue = jest.fn();
    await render(
      <FirstActionStep
        lines={lines}
        northStar="The Patriarch"
        onChoose={onChoose}
        onContinue={onContinue}
        reflectionLed
        value={null}
      />,
    );

    expect(screen.getByText('NORTH STAR · THE PATRIARCH')).toBeOnTheScreen();
    expect(screen.getByText(lines[1].action)).toBeOnTheScreen();
    expect(screen.getAllByText(new RegExp(lines[1].person))).toHaveLength(2);
    await fireEvent.press(screen.getByRole('button', { name: 'Start with this one' }));
    expect(onChoose).toHaveBeenCalledWith(lines[0].id);
    expect(onContinue).toHaveBeenCalledTimes(1);
  });

  it('asks for the one check-in and lets him decline it', async () => {
    const onSkip = jest.fn();
    await render(<CheckInStep onAllow={jest.fn()} onSkip={onSkip} time="21:00" />);

    expect(screen.getByText(/At 21:00 on the day you chose/)).toBeOnTheScreen();
    await fireEvent.press(screen.getByRole('button', { name: 'Not now' }));
    expect(onSkip).toHaveBeenCalledTimes(1);
  });
});
