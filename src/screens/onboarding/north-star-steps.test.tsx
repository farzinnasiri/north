import { fireEvent, render, screen } from '@testing-library/react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import type { NorthStarType } from '@/domains/onboarding/onboarding';
import {
  StarQuestionStep,
  StarRevealStep,
} from '@/screens/onboarding/north-star-steps';

describe('StarQuestionStep', () => {
  it('saves a choice locally and advances only when Continue is pressed', async () => {
    const onChange = jest.fn();
    const onContinue = jest.fn();

    await render(
      <StarQuestionStep
        id="ordinary-day"
        onChange={onChange}
        onContinue={onContinue}
        profile={{ age: 30, name: 'Farzin' }}
        value={[]}
      />,
    );

    expect(screen.getByText('In 5 years · Age 35')).toBeOnTheScreen();
    expect(screen.getByRole('button', { name: 'Continue' })).toBeDisabled();
    await fireEvent.press(screen.getByRole('checkbox', { name: 'Independent work, my own schedule' }));
    expect(onChange).toHaveBeenCalledWith('ordinary-day', ['independent']);
    expect(onContinue).not.toHaveBeenCalled();
  });
});

describe('StarRevealStep', () => {
  it('commits the viewed archetype only when the primary action is pressed', async () => {
    const onContinue = jest.fn();
    const onChoose = jest.fn();
    const ranked: NorthStarType[] = [
      'patriarch',
      'modern-man',
      'rogue',
      'laughing-wolf',
      'godfather',
      'kind-father',
      'freethinker',
      'playboy',
    ];

    function Harness() {
      // The app wraps every screen in this root (see AppShell); Gesture Handler 3 requires it.
      return (
        <GestureHandlerRootView>
        <StarRevealStep
          name="Farzin"
          onChoose={onChoose}
          onContinue={onContinue}
          ranked={ranked}
          value={null}
        />
        </GestureHandlerRootView>
      );
    }

    await render(<Harness />);

    expect(screen.queryByRole('radio')).not.toBeOnTheScreen();
    expect(screen.getByRole('button', { name: 'Choose this life' })).toBeEnabled();
    expect(onContinue).not.toHaveBeenCalled();

    await fireEvent.press(screen.getByRole('button', { name: 'Next' }));
    expect(onChoose).not.toHaveBeenCalled();
    await fireEvent.press(screen.getByRole('button', { name: 'Choose this life' }));
    expect(onChoose).toHaveBeenCalledWith('modern-man');
    expect(onContinue).toHaveBeenCalledTimes(1);
  });
});
