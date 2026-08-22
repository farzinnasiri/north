import { fireEvent, render, screen } from '@testing-library/react-native';

import { InstrumentSlider } from '@/components/ui/instrument-slider';

describe('InstrumentSlider', () => {
  // The grip travels on a transform rather than `left`, so the assertion moved
  // with it. The rule is unchanged: at either end it stays inside the track.
  it.each([
    { expectedOffset: 0, value: 0 },
    { expectedOffset: 292, value: 10 },
  ])('keeps the grip inside a 320px track at value $value', async ({ expectedOffset, value }) => {
    await render(
      <InstrumentSlider
        accessibilityLabel="Test slider"
        leftLabel="Minimum"
        maximum={10}
        onChange={jest.fn()}
        rightLabel="Maximum"
        value={value}
      />,
    );

    await fireEvent(screen.getByLabelText('Test slider'), 'layout', {
      nativeEvent: { layout: { width: 320 } },
    });

    expect(screen.getByTestId('slider-grip')).toHaveStyle({
      transform: [{ translateX: expectedOffset }],
    });
  });
});
