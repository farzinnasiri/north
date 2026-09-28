import { act, fireEvent, render, screen } from '@testing-library/react-native';

import { saveRealityCard } from '@/platform/reality-card-actions';
import { RealityReveal } from '@/screens/onboarding/reality-reveal';

jest.mock('@/platform/reality-card-actions', () => ({
  saveRealityCard: jest.fn().mockResolvedValue('done'),
}));

const readings = [
  { axis: 'agency', off: 45 },
  { axis: 'desire', off: 38 },
  { axis: 'connection', off: 91 },
  { axis: 'appetite', off: 22 },
  { axis: 'craft', off: 31 },
  { axis: 'frame', off: 47 },
] as const;

describe('Reality reveal', () => {
  it('shows broad answer patterns without presenting unvalidated degrees as scientific precision', async () => {
    await render(<RealityReveal onContinue={jest.fn()} readings={[...readings]} />);

    expect(screen.getByLabelText(
      'Where you stand across six axes. AGENCY, mixed evidence. DESIRE, mixed evidence. CONNECTION, may need attention. SELF-COMMAND, pattern looks steady. CRAFT, pattern looks steady. FRAME, mixed evidence',
    )).toBeOnTheScreen();
    expect(screen.getByText("Here's where you stand.")).toBeOnTheScreen();
    expect(screen.queryByText('This is the picture your answers make.')).not.toBeOnTheScreen();
    expect(screen.queryByText('YOUR REALITY')).not.toBeOnTheScreen();
    expect(screen.queryByText('LARGEST GAP')).not.toBeOnTheScreen();
    expect(screen.queryByText('SAVE')).not.toBeOnTheScreen();
    expect(screen.queryByText('START HERE')).not.toBeOnTheScreen();
    expect(screen.queryByText(/91°/)).not.toBeOnTheScreen();
    expect(screen.queryByRole('button', { name: 'SHARE' })).not.toBeOnTheScreen();

    await act(async () => {
      fireEvent.press(screen.getByRole('button', { name: 'Save image' }));
    });
    expect(saveRealityCard).toHaveBeenCalledTimes(1);
  });
});
