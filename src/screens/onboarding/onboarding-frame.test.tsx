import { act, fireEvent, render, screen, within } from '@testing-library/react-native';
import { Text } from 'react-native';
import type { SharedValue } from 'react-native-reanimated';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import {
  GREETING_CALIBRATE_AT,
  OnboardingFrame,
  OnboardingShell,
} from '@/screens/onboarding/onboarding-frame';
import { OnboardingProgressProvider } from '@/screens/onboarding/onboarding-progress';
import { motion } from '@/theme';

describe('OnboardingFrame', () => {
  it('allows one continuation while the current page is leaving', async () => {
    const onContinue = jest.fn();
    await render(
      <OnboardingFrame actionLabel="Continue" onContinue={onContinue} title="One answer at a time." />,
    );

    const action = screen.getByRole('button', { name: 'Continue' });
    await fireEvent.press(action);
    await fireEvent.press(action);

    expect(onContinue).toHaveBeenCalledTimes(1);
  });

  it('places a short statement in the optical middle of its usable field', async () => {
    await render(
      <OnboardingFrame presentation="statement" title="Let those answers stand." />,
    );

    expect(screen.getByTestId('onboarding-statement-stage')).toHaveStyle({
      justifyContent: 'center',
      paddingBottom: 0,
    });
    expect(screen.queryByTestId('onboarding-frame-content')).not.toBeOnTheScreen();
  });

  it('lets a longer statement contribute its intrinsic height', async () => {
    await render(
      <OnboardingFrame presentation="statement" title="This is meant to end.">
        <Text>The closing letter.</Text>
      </OnboardingFrame>,
    );

    expect(screen.getByTestId('onboarding-frame-content')).toHaveStyle({
      flexGrow: 0,
      flexShrink: 0,
    });
  });

  it('keeps Back in the bottom action lane on every reversible step', async () => {
    const onBack = jest.fn();
    await render(
      <SafeAreaProvider initialMetrics={SAFE_AREA_METRICS}>
        <OnboardingShell onBack={onBack}>
          <OnboardingFrame
            actionLabel="Continue"
            onContinue={jest.fn()}
            title="One answer at a time."
          />
        </OnboardingShell>
      </SafeAreaProvider>,
    );

    const actionLane = screen.getByTestId('onboarding-actions');
    const back = within(actionLane).getByRole('button', { name: 'Back' });
    await fireEvent.press(back);

    expect(onBack).toHaveBeenCalledTimes(1);
  });

  it('keeps Back reachable when a step has no primary action', async () => {
    await render(
      <SafeAreaProvider initialMetrics={SAFE_AREA_METRICS}>
        <OnboardingShell onBack={jest.fn()}>
          <OnboardingFrame presentation="statement" title="Ordering the eight lives." />
        </OnboardingShell>
      </SafeAreaProvider>,
    );

    expect(
      within(screen.getByTestId('onboarding-actions')).getByRole('button', { name: 'Back' }),
    ).toBeOnTheScreen();
  });

  it('places the question count below the progress rail', async () => {
    await render(
      <SafeAreaProvider initialMetrics={SAFE_AREA_METRICS}>
        <OnboardingProgressProvider
          value={{
            answered: 29,
            ceremony: { value: 0 } as SharedValue<number>,
            direction: 47,
            phase: 1,
            phaseFraction: 0.5,
            phases: ['Start', 'Questions'],
            prompt: { current: 30, total: 30 },
            step: 30,
            total: 40,
          }}
        >
          <OnboardingShell>
            <OnboardingFrame title="One answer at a time." />
          </OnboardingShell>
        </OnboardingProgressProvider>
      </SafeAreaProvider>,
    );

    expect(screen.getByTestId('onboarding-progress-lane')).toHaveStyle({
      alignItems: 'flex-start',
      flexDirection: 'column',
    });
    expect(screen.getByText('QUESTION 30 OF 30')).toBeOnTheScreen();
  });

  it('greets him with a compass that finds north, after the name', async () => {
    jest.useFakeTimers();
    const progress = {
      answered: 0,
      ceremony: { value: 0 } as SharedValue<number>,
      direction: 90,
      phase: 0,
      phaseFraction: 0,
      phases: ['You', 'Reality'],
      prompt: null,
      step: 1,
      total: 20,
    };
    const shell = (hideInstrument: boolean, introducing: boolean) => (
      <SafeAreaProvider initialMetrics={SAFE_AREA_METRICS}>
        <OnboardingProgressProvider value={progress}>
          <OnboardingShell hideInstrument={hideInstrument} introducing={introducing}>
            <OnboardingFrame title="What should I call you?" />
          </OnboardingShell>
        </OnboardingProgressProvider>
      </SafeAreaProvider>
    );

    try {
      const view = await render(shell(true, false));
      expect(screen.queryByRole('image')).not.toBeOnTheScreen();

      await view.rerender(shell(false, true));
      expect(screen.getByRole('image', { name: '38 degrees off north. North is zero.' })).toBeOnTheScreen();

      await act(() => jest.advanceTimersByTime(GREETING_CALIBRATE_AT));
      expect(screen.getByRole('image', { name: '0 degrees off north. North is zero.' })).toBeOnTheScreen();

      await act(() => jest.advanceTimersByTime(motion.arrival * 2));
      await view.unmount();
    } finally {
      jest.useRealTimers();
    }
  });
});

const SAFE_AREA_METRICS = {
  frame: { height: 844, width: 390, x: 0, y: 0 },
  insets: { bottom: 34, left: 0, right: 0, top: 47 },
};
