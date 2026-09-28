import { render, screen } from '@testing-library/react-native';

import { beginJourney } from '@/domains/journey/journey';
import { You } from '@/screens/you';

const mockJourney = beginJourney({
  at: Date.UTC(2026, 7, 26),
  direction: 91,
  honestThing: 'connection',
  name: 'Farzin',
  northStar: 'patriarch',
  readings: [
    { axis: 'agency', off: 45 },
    { axis: 'desire', off: 38 },
    { axis: 'connection', off: 91 },
    { axis: 'appetite', off: 22 },
    { axis: 'craft', off: 31 },
    { axis: 'frame', off: 47 },
  ],
});

jest.mock('expo-router', () => ({
  Link: ({ children }: { children: React.ReactNode }) => children,
}));

jest.mock('@/domains/journey/store', () => ({
  useJourney: (selector: (state: { journey: typeof mockJourney }) => unknown) => selector({ journey: mockJourney }),
}));

describe('You', () => {
  it('presents the authored identity once with the current reading and without the onboarding Contract', async () => {
    await render(<You />);

    expect(screen.getAllByText(/the patriarch/i)).toHaveLength(1);
    expect(screen.getByText('WHERE YOU STAND')).toBeOnTheScreen();
    expect(screen.getByText('MAY NEED ATTENTION')).toBeOnTheScreen();
    expect(screen.queryByText('91°')).not.toBeOnTheScreen();
    expect(screen.queryByText('CONTRACT')).not.toBeOnTheScreen();
    expect(screen.queryByText('NO CLOSEOUTS')).not.toBeOnTheScreen();
  });
});
