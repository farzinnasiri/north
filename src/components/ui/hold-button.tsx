import { useEffect, useMemo, useRef, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  Easing,
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { colors, motion, radii, typography } from '@/theme';

type HoldButtonProps = {
  /** How long his hand has to stay down, in milliseconds. */
  duration: number;
  label: string;
  /** Replaces the label while his hand is down. */
  holdingLabel: string;
  /** Reports the hand going down and coming up, so a caller can answer it. */
  onHoldChange?: (holding: boolean) => void;
  onComplete: () => void;
  /** Fires as each graduation is crossed, from 1 to `steps`. */
  onStep?: (step: number) => void;
  steps: number;
};

/**
 * A button that has to be held. The fill sweeps across under his thumb and the
 * label flips to the dark brass side as it passes, so the control reads as one
 * object being filled rather than a bar sitting behind a word.
 *
 * Both movements are transforms behind a clip: filling by animating width
 * would re-run layout on the label sixty times a second for the whole hold.
 */
export function HoldButton({
  duration,
  holdingLabel,
  label,
  onComplete,
  onHoldChange,
  onStep,
  steps,
}: HoldButtonProps) {
  const reduceMotion = useReducedMotion();
  const [width, setWidth] = useState(0);
  const [holding, setHolding] = useState(false);
  const [done, setDone] = useState(false);
  const fill = useSharedValue(0);
  // The hold has to survive every render it causes. Lighting a clause
  // re-renders the screen around this button, and rebuilding the timer on that
  // would push the finish line further away every time it moved.
  const latest = useRef({ onComplete, onStep });

  useEffect(() => {
    latest.current = { onComplete, onStep };
  }, [onComplete, onStep]);

  // Reported from state rather than from the gesture, so the gesture object
  // never has to be rebuilt for a changing callback — rebuilding it mid-hold
  // would drop the hand.
  useEffect(() => {
    onHoldChange?.(holding);
  }, [holding, onHoldChange]);

  useEffect(() => {
    fill.value = withTiming(holding ? 1 : 0, {
      duration: reduceMotion ? 0 : holding ? duration : motion.quick,
      // Linear while filling: his hand is doing the work, and easing it would
      // misreport how much of the hold is left. Release snaps.
      easing: holding ? Easing.linear : Easing.bezier(0.23, 1, 0.32, 1),
    });
  }, [duration, fill, holding, reduceMotion]);

  // Graduations are counted on their own clock rather than sampled from the
  // animation, so the haptic and the caller's step land on the same beat.
  useEffect(() => {
    if (!holding || done) return;

    let crossed = 0;
    const ticker = setInterval(() => {
      crossed += 1;
      if (crossed < steps) {
        latest.current.onStep?.(crossed);
        return;
      }
      clearInterval(ticker);
      setDone(true);
      latest.current.onStep?.(steps);
      latest.current.onComplete();
    }, duration / steps);

    return () => clearInterval(ticker);
  }, [done, duration, holding, steps]);

  const gesture = useMemo(
    () =>
      Gesture.LongPress()
        .runOnJS(true)
        // Never activates on its own: the fill closing is what commits.
        .minDuration(duration * 4)
        .maxDistance(9999)
        .onBegin(() => setHolding(true))
        .onFinalize(() => setHolding(false)),
    [duration],
  );

  const sweep = useAnimatedStyle(() => ({
    transform: [{ translateX: -width * (1 - fill.value) }],
  }));
  const counter = useAnimatedStyle(() => ({
    transform: [{ translateX: width * (1 - fill.value) }],
  }));

  return (
    <GestureDetector gesture={gesture}>
      <View
        accessibilityHint="Press and hold until the line closes."
        accessibilityRole="button"
        accessibilityLabel={label}
        onLayout={(event) => setWidth(event.nativeEvent.layout.width)}
        style={styles.button}
      >
        <Text style={[styles.label, styles.outlined]}>{holding ? holdingLabel : label}</Text>

        <View style={styles.clip}>
          <Animated.View
            accessibilityElementsHidden
            importantForAccessibility="no-hide-descendants"
            style={[styles.fill, { width }, sweep]}
          >
            <Animated.View style={counter}>
              <Text style={[styles.label, styles.filled]}>
                {holding ? holdingLabel : label}
              </Text>
            </Animated.View>
          </Animated.View>
        </View>
      </View>
    </GestureDetector>
  );
}

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    borderColor: colors.brass,
    borderCurve: 'continuous',
    borderRadius: radii.control,
    borderWidth: 1,
    justifyContent: 'center',
    minHeight: 56,
    overflow: 'hidden',
    width: '100%',
  },
  clip: {
    bottom: 0,
    left: 0,
    overflow: 'hidden',
    position: 'absolute',
    right: 0,
    top: 0,
  },
  filled: {
    color: colors.brassOn,
  },
  fill: {
    alignItems: 'center',
    backgroundColor: colors.brass,
    flex: 1,
    justifyContent: 'center',
  },
  label: {
    fontFamily: typography.monoMedium,
    fontSize: 12,
    letterSpacing: 1.6,
  },
  outlined: {
    color: colors.brass,
  },
});
