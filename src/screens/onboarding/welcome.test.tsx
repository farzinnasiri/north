import { fireEvent, render, screen } from '@testing-library/react-native';

import { Welcome } from '@/screens/onboarding/welcome';

describe('Welcome', () => {
  it('sets an honest expectation before the questions begin', async () => {
    const onContinue = jest.fn();
    await render(<Welcome onContinue={onContinue} />);

    expect(
      screen.getByText(
        '30 questions. About 10 minutes. Answer based on what you actually did.',
      ),
    ).toBeOnTheScreen();

    await fireEvent.press(screen.getByRole('button', { name: 'Start' }));
    expect(onContinue).toHaveBeenCalledTimes(1);
  });
});
