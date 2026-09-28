import { fireEvent, render, screen } from '@testing-library/react-native';

import { QUESTIONS } from '@/domains/onboarding/onboarding';
import { QuestionStep } from '@/screens/onboarding/question-step';

describe('QuestionStep', () => {
  it('starts unselected and requires Continue after a choice', async () => {
    const onAnswer = jest.fn();
    const question = QUESTIONS[0];

    await render(
      <QuestionStep
        onAnswer={onAnswer}
        profile={{ age: 30, name: 'Farzin' }}
        question={question}
      />,
    );

    expect(screen.getByRole('button', { name: 'Continue' })).toBeDisabled();

    await fireEvent.press(screen.getByRole('radio', { name: 'Never' }));
    expect(onAnswer).not.toHaveBeenCalled();
    expect(screen.getByRole('button', { name: 'Continue' })).not.toBeDisabled();

    await fireEvent.press(screen.getByRole('button', { name: 'Continue' }));
    expect(onAnswer).toHaveBeenCalledTimes(1);
    expect(onAnswer).toHaveBeenCalledWith(expect.objectContaining({ id: 'F1', off: 100, raw: 1 }));
  });

  it('uses the phrase authored for emphasis instead of highlighting every second-person word', async () => {
    const question = QUESTIONS[0];
    await render(
      <QuestionStep
        onAnswer={jest.fn()}
        profile={{ age: 30, name: 'Farzin' }}
        question={question}
      />,
    );

    expect(screen.getByText(question.emphasis)).toHaveStyle({ fontWeight: '500' });
  });
});
