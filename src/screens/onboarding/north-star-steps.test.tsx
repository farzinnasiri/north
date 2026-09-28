import { fireEvent, render, screen } from '@testing-library/react-native';

import type { NorthStarType } from '@/domains/onboarding/onboarding';
import {
  NorthStarIntroStep,
  StarQuestionStep,
  StarRevealStep,
} from '@/screens/onboarding/north-star-steps';

describe('NorthStarIntroStep', () => {
  it('introduces the choice without explaining the flow twice', async () => {
    await render(<NorthStarIntroStep onContinue={jest.fn()} />);

    expect(screen.getByText('What matters most?')).toBeOnTheScreen();
    expect(screen.getByRole('button', { name: 'Continue' })).toBeEnabled();
    expect(screen.queryByText('REALITY COMPLETE')).not.toBeOnTheScreen();
    expect(screen.queryByText(/There is no best answer/)).not.toBeOnTheScreen();
  });
});

describe('StarQuestionStep', () => {
  it('saves a choice locally and advances only when Continue is pressed', async () => {
    const onChange = jest.fn();
    const onContinue = jest.fn();

    await render(
      <StarQuestionStep
        id="building-time"
        onChange={onChange}
        onContinue={onContinue}
        profile={{ age: 30, name: 'Farzin' }}
        value={[]}
      />,
    );

    expect(screen.getByRole('button', { name: 'Continue' })).toBeDisabled();
    await fireEvent.press(screen.getByRole('radio', { name: 'They matter about the same' }));
    expect(onChange).toHaveBeenCalledWith('building-time', ['equal']);
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
      return (
        <StarRevealStep
          name="Farzin"
          onChoose={onChoose}
          onContinue={onContinue}
          ranked={ranked}
          value={null}
        />
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
