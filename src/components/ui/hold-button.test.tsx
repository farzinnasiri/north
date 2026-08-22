import { act, render, screen } from '@testing-library/react-native';
import { useState } from 'react';
import type { ReactNode } from 'react';

import { Text } from 'react-native';

import { HoldButton } from '@/components/ui/hold-button';

const hold: { begin?: () => void; finalize?: () => void } = {};

jest.mock('react-native-gesture-handler', () => {
  return {
    Gesture: {
      LongPress: () => {
        const gesture = {
          maxDistance: () => gesture,
          minDuration: () => gesture,
          onBegin: (handler: () => void) => {
            hold.begin = handler;
            return gesture;
          },
          onFinalize: (handler: () => void) => {
            hold.finalize = handler;
            return gesture;
          },
          runOnJS: () => gesture,
        };
        return gesture;
      },
    },
    GestureDetector: ({ children }: { children: ReactNode }) => children,
  };
});

const complete = jest.fn();
const step = jest.fn();

function press(ms: number) {
  return act(() => {
    jest.advanceTimersByTime(ms);
  });
}

async function mount(duration = 10000, steps = 5) {
  await render(
    <HoldButton
      duration={duration}
      holdingLabel="KEEP YOUR HAND THERE"
      label="HOLD TO COMMIT"
      onComplete={complete}
      onStep={step}
      steps={steps}
    />,
  );
}

/**
 * The real screen lights a clause on every step, which re-renders this button's
 * parent and hands it new callbacks. Before the fix that reproduced here, each
 * of those renders rebuilt the timer and pushed the finish line two seconds
 * further away, so a ten-second hold could never end.
 */
function Ceremony() {
  const [lit, setLit] = useState(0);

  return (
    <>
      <HoldButton
        duration={10000}
        holdingLabel="KEEP YOUR HAND THERE"
        label="HOLD TO COMMIT"
        onComplete={() => complete()}
        onStep={(value) => {
          setLit(value);
          step(value);
        }}
        steps={5}
      />
      <Text>{`lit ${lit}`}</Text>
    </>
  );
}

describe('HoldButton', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    complete.mockClear();
    step.mockClear();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('does not commit when the hand comes up early', async () => {
    await mount();

    await act(() => hold.begin?.());
    await press(9999);
    await act(() => hold.finalize?.());
    await press(30000);

    expect(complete).not.toHaveBeenCalled();
  });

  it('gives up everything it counted when the hand comes up', async () => {
    await mount();

    await act(() => hold.begin?.());
    await press(6000);

    expect(step).toHaveBeenLastCalledWith(3);

    step.mockClear();
    await act(() => hold.finalize?.());
    await act(() => hold.begin?.());
    await press(2000);

    expect(step).toHaveBeenLastCalledWith(1);
  });

  it('reports each graduation as it is crossed', async () => {
    await mount();

    await act(() => hold.begin?.());
    await press(10000);

    expect(step.mock.calls.map(([value]) => value)).toStrictEqual([1, 2, 3, 4, 5]);
  });

  it('commits once when the hand stays down for the whole duration', async () => {
    await mount();

    await act(() => hold.begin?.());
    await press(10000);

    expect(complete).toHaveBeenCalledTimes(1);

    await act(() => hold.finalize?.());
    await act(() => hold.begin?.());
    await press(10000);

    expect(complete).toHaveBeenCalledTimes(1);
  });

  it('finishes on time even though every step re-renders the screen', async () => {
    await render(<Ceremony />);

    await act(() => hold.begin?.());
    // One graduation at a time, so React commits the re-render each step
    // causes before the next one is due — which is what the real screen does.
    for (let graduation = 0; graduation < 5; graduation += 1) {
      await press(2000);
    }

    expect(screen.getByText('lit 5')).toBeOnTheScreen();
    expect(complete).toHaveBeenCalledTimes(1);
  });

  it('names what it is asking for while the hand is down', async () => {
    await mount();

    await act(() => hold.begin?.());

    expect(screen.getAllByText('KEEP YOUR HAND THERE').length).toBeGreaterThan(0);
  });
});
