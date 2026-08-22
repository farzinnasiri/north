import { fireEvent, render, screen } from '@testing-library/react-native';

import { NorthButton } from '@/components/ui/north-button';

// Worked example of the standard in AGENTS.md: every case below fails if the
// behaviour it names breaks. None of them assert that something merely exists.
//
// Note that render and fireEvent are async in React Native Testing Library 14.
// Forgetting to await them silently asserts against a Promise rather than the
// rendered tree, which passes for the wrong reason.
describe('NorthButton', () => {
  it('offers its label to assistive technology as a button', async () => {
    await render(<NorthButton label="Close it out" />);

    expect(screen.getByRole('button', { name: 'Close it out' })).toBeOnTheScreen();
  });

  it('runs its action once per press', async () => {
    const onPress = jest.fn();
    await render(<NorthButton label="Close it out" onPress={onPress} />);

    await fireEvent.press(screen.getByRole('button', { name: 'Close it out' }));

    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it('does nothing when disabled', async () => {
    const onPress = jest.fn();
    await render(<NorthButton disabled label="Close it out" onPress={onPress} />);

    await fireEvent.press(screen.getByRole('button', { name: 'Close it out' }));

    expect(onPress).not.toHaveBeenCalled();
  });

  it('tells assistive technology that a disabled action is unavailable', async () => {
    await render(<NorthButton disabled label="Close it out" />);

    expect(screen.getByRole('button', { name: 'Close it out' })).toBeDisabled();
  });
});
