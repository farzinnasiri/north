import { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import Svg, { Circle, G, Line, Polygon } from 'react-native-svg';

import { colors, motion } from '@/theme';

type CompassProgressProps = {
  /** Running bearing estimate from the answers so far, 0-180. */
  bearing: number;
  /** Questions answered, 0-20. Fills the ring. */
  answered: number;
  total?: number;
  size?: number;
};

/**
 * A compass, not a clock. The previous version ringed the dial with twenty
 * evenly spaced graduations and a hairline hand, which is the exact recipe for
 * a watch face. Progress is now an arc closing around the rim, the only
 * graduations are the four cardinals, and the needle is a lozenge with a
 * weighted north half — the three things that make a compass legible at a
 * glance.
 */
export function CompassProgress({
  answered,
  bearing,
  size = 72,
  total = 20,
}: CompassProgressProps) {
  const reduceMotion = useReducedMotion();
  const rotation = useSharedValue(bearing);
  const centre = size / 2;
  const rim = centre - 2;
  const ratio = Math.min(1, answered / total);
  const circumference = 2 * Math.PI * rim;

  useEffect(() => {
    if (reduceMotion) {
      rotation.value = withTiming(bearing, { duration: motion.settle });
      return;
    }
    rotation.value = withSpring(bearing, {
      damping: motion.needleDamping,
      mass: motion.needleMass,
      overshootClamping: true,
      stiffness: motion.needleStiffness,
    });
  }, [bearing, reduceMotion, rotation]);

  const needle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotation.value}deg` }],
  }));

  const cardinal = (angle: number, long: boolean) => {
    const radians = ((angle - 90) * Math.PI) / 180;
    const from = rim - (long ? 9 : 5);
    return {
      x1: centre + Math.cos(radians) * from,
      x2: centre + Math.cos(radians) * (rim - 2),
      y1: centre + Math.sin(radians) * from,
      y2: centre + Math.sin(radians) * (rim - 2),
    };
  };

  return (
    <View
      accessibilityLabel={`${answered} of ${total} readings taken`}
      accessibilityRole="progressbar"
      accessibilityValue={{ max: total, min: 0, now: answered }}
      style={[styles.dial, { height: size, width: size }]}
    >
      <Svg height={size} width={size}>
        <Circle cx={centre} cy={centre} fill="none" r={rim} stroke={colors.lineSoft} strokeWidth={1} />
        {/* Progress closes around the rim rather than ticking around it. */}
        <G transform={`rotate(-90 ${centre} ${centre})`}>
          <Circle
            cx={centre}
            cy={centre}
            fill="none"
            r={rim}
            stroke={colors.brassDim}
            strokeDasharray={`${circumference * ratio} ${circumference}`}
            strokeLinecap="round"
            strokeWidth={2}
          />
        </G>
        {[0, 90, 180, 270].map((angle) => {
          const long = angle === 0;
          return (
            <Line
              key={angle}
              stroke={long ? colors.paper : colors.line}
              strokeWidth={long ? 1.5 : 1}
              {...cardinal(angle, long)}
            />
          );
        })}
      </Svg>

      <Animated.View style={[styles.needleBox, { height: size, width: size }, needle]}>
        <Svg height={size} width={size}>
          <Polygon
            fill={colors.brass}
            points={`${centre},${centre - rim + 10} ${centre - 3},${centre} ${centre + 3},${centre}`}
          />
          <Polygon
            fill={colors.line}
            points={`${centre},${centre + rim - 14} ${centre - 3},${centre} ${centre + 3},${centre}`}
          />
        </Svg>
      </Animated.View>

      <View style={styles.hub} />
    </View>
  );
}

const styles = StyleSheet.create({
  dial: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  hub: {
    backgroundColor: colors.fieldDeep,
    borderColor: colors.ash,
    borderRadius: 3,
    borderWidth: 1,
    height: 5,
    position: 'absolute',
    width: 5,
  },
  needleBox: {
    position: 'absolute',
  },
});
