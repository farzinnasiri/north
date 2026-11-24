import { act, fireEvent, render, screen } from '@testing-library/react-native';
import { useReducedMotion } from 'react-native-reanimated';

import { GREETING_COPY_AT } from '@/screens/onboarding/onboarding-frame';
import { Welcome } from '@/screens/onboarding/welcome';
import { motion } from '@/theme';

jest.mock('react-native-reanimated', () => ({
  __esModule: true,
  ...jest.requireActual('react-native-reanimated'),
  useReducedMotion: jest.fn(() => false),
}));

describe('Welcome', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    jest.mocked(useReducedMotion).mockReturnValue(false);
  });
  afterEach(() => {
    jest.useRealTimers();
    jest.restoreAllMocks();
  });

  it('greets the person and enables onboarding after the final introduction beat', async () => {
    const onContinue = jest.fn();
    await render(<Welcome name="Farzin" onContinue={onContinue} />);

    expect(screen.getByText("Hi, Farzin.\nI'm North.")).toBeOnTheScreen();
    expect(screen.getByText('Before I can help, I need to know you a little.')).toBeOnTheScreen();
    expect(screen.getByText('Onboarding takes about 5 minutes.')).toBeOnTheScreen();
    expect(screen.getByRole('button', { name: 'Start onboarding' })).toBeDisabled();
    await fireEvent.press(screen.getByRole('button', { name: 'Start onboarding' }));
    expect(onContinue).not.toHaveBeenCalled();

    await act(() => jest.advanceTimersByTime(GREETING_COPY_AT + motion.settle + motion.arrival + motion.quick + motion.instant));
    expect(screen.getByRole('button', { name: 'Start onboarding' })).toBeEnabled();

    await fireEvent.press(screen.getByRole('button', { name: 'Start onboarding' }));
    expect(onContinue).toHaveBeenCalledTimes(1);
  });

  it('makes onboarding available immediately with reduced motion', async () => {
    jest.mocked(useReducedMotion).mockReturnValue(true);
    await render(<Welcome name="Farzin" onContinue={jest.fn()} />);
    expect(screen.getByRole('button', { name: 'Start onboarding' })).toBeEnabled();
  });
});
