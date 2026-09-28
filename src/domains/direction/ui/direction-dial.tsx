import { useEffect, useRef, useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import Animated, {
  useAnimatedProps,
  useReducedMotion,
  useSharedValue,
  withSequence,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import Svg, { Circle, G, Line, Path, Text as SvgText } from 'react-native-svg';

import { NorthText } from '@/components/ui/north-text';
import { useSignalTheme } from '@/components/ui/signal-theme';
import { colors, motion, typography } from '@/theme';

const AnimatedG = Animated.createAnimatedComponent(G);
const AnimatedPath = Animated.createAnimatedComponent(Path);
const CENTRE = 130;
const ARC_RADIUS = 107;

type DirectionDialProps = {
  direction: number;
  size: number;
  startingDirection: number;
};

/**
 * One physical instrument carries the current position and the destination.
 * A tap temporarily rewinds the needle to the onboarding position, making the
 * comparison useful instead of adding a second progress graphic below it.
 */
export function DirectionDial({ direction, size, startingDirection }: DirectionDialProps) {
  const reduceMotion = useReducedMotion();
  const signal = useSignalTheme();
  const current = clampDirection(direction);
  const start = clampDirection(startingDirection);
  const [showingStart, setShowingStart] = useState(false);
  const shown = showingStart ? start : current;
  const needle = useSharedValue(current);
  const mounted = useRef(false);

  useEffect(() => {
    if (!mounted.current) {
      mounted.current = true;
      needle.value = shown;
      return;
    }
    const spring = {
      damping: motion.needleDamping,
      mass: motion.needleMass,
      stiffness: motion.needleStiffness,
    };
    if (reduceMotion) {
      needle.value = withTiming(shown, { duration: 0 });
    } else if (Math.abs(start - current) < 0.1) {
      const calibration = shown < 174 ? shown + 6 : shown - 6;
      needle.value = withSequence(withSpring(calibration, spring), withSpring(shown, spring));
    } else {
      needle.value = withSpring(shown, spring);
    }
  }, [current, needle, reduceMotion, showingStart, shown, start]);

  useEffect(() => {
    if (!showingStart) return;

    const returnToNow = setTimeout(() => setShowingStart(false), 1800);
    return () => clearTimeout(returnToNow);
  }, [showingStart]);

  const needleProps = useAnimatedProps(() => ({
    transform: `rotate(${needle.value} ${CENTRE} ${CENTRE})`,
  }));
  const arcProps = useAnimatedProps(() => ({
    d: arcPath(0, needle.value, ARC_RADIUS),
  }));

  return (
    <Pressable
      accessibilityHint={showingStart ? 'Returns to your current direction' : 'Briefly shows your starting direction'}
      accessibilityLabel={showingStart
        ? `Starting direction: ${format(start)} degrees off North.`
        : `${format(current)} degrees off North. North is zero degrees.`}
      accessibilityRole="button"
      onPress={() => setShowingStart((value) => !value)}
      style={{ height: size, width: size }}
    >
      <Svg height={size} viewBox="0 0 260 260" width={size}>
        <Circle cx={CENTRE} cy={CENTRE} fill={colors.field} r="116" stroke={colors.line} strokeWidth="1.4" />
        <Circle cx={CENTRE} cy={CENTRE} fill={colors.fieldDeep} r="101" stroke={colors.lineSoft} strokeWidth="1.2" />

        {Array.from({ length: 36 }, (_, index) => {
          const major = index % 3 === 0;
          return (
            <Line
              key={index}
              stroke={index === 0 ? signal.primary : major ? colors.ash : colors.slate}
              strokeOpacity={major || index === 0 ? 0.9 : 0.58}
              strokeWidth={index === 0 ? 3 : major ? 1.8 : 1}
              transform={`rotate(${index * 10} ${CENTRE} ${CENTRE})`}
              x1={CENTRE}
              x2={CENTRE}
              y1={14}
              y2={major ? 27 : 23}
            />
          );
        })}

        {shown > 0 ? (
          <AnimatedPath
            animatedProps={arcProps}
            fill="none"
            stroke={showingStart ? colors.meridian : signal.primary}
            strokeLinecap="round"
            strokeWidth="3.5"
          />
        ) : null}

        <G fill={colors.ash} fontFamily={typography.monoMedium} fontSize="9" textAnchor="middle">
          <SvgText fill={signal.primary} x={CENTRE} y="42">NORTH</SvgText>
          <SvgText x={CENTRE} y="224">S</SvgText>
          <SvgText x="39" y="133">W</SvgText>
          <SvgText x="221" y="133">E</SvgText>
        </G>

        <AnimatedG animatedProps={needleProps}>
          <Path
            d="M 130 130 L 124 133 L 130 39 L 136 133 Z"
            fill={showingStart ? colors.meridian : signal.primary}
          />
          <Path d="M 130 130 L 126 130 L 130 166 L 134 130 Z" fill={colors.slate} />
          <Circle
            cx={CENTRE}
            cy={CENTRE - ARC_RADIUS}
            fill={showingStart ? colors.meridian : signal.primary}
            r="5"
            stroke={colors.fieldDeep}
            strokeWidth="2"
          />
        </AnimatedG>

        <Circle cx={CENTRE} cy={CENTRE} fill={colors.fieldDeep} r="10" stroke={colors.paper} strokeWidth="3" />
        <Circle cx={CENTRE} cy={CENTRE} fill={showingStart ? colors.meridian : signal.primary} r="3.5" />
      </Svg>

      <View pointerEvents="none" style={styles.readout}>
        <NorthText style={styles.value} variant="data">{format(shown)}°</NorthText>
        <NorthText variant="label">{showingStart ? 'WHERE YOU STARTED' : 'OFF NORTH'}</NorthText>
      </View>
      <View pointerEvents="none" style={styles.tapHint}>
        <NorthText variant="label">TAP · {showingStart ? 'BACK TO NOW' : 'COMPARE START'}</NorthText>
      </View>
    </Pressable>
  );
}

function clampDirection(value: number): number {
  return Math.max(0, Math.min(180, value));
}

function format(value: number): string {
  return Number.isInteger(value) ? `${value}` : value.toFixed(1);
}

function pointOnDial(angle: number, radius: number): { x: number; y: number } {
  'worklet';
  const radians = ((angle - 90) * Math.PI) / 180;
  return {
    x: CENTRE + radius * Math.cos(radians),
    y: CENTRE + radius * Math.sin(radians),
  };
}

function arcPath(from: number, to: number, radius: number): string {
  'worklet';
  const start = pointOnDial(from, radius);
  const end = pointOnDial(to, radius);
  return `M ${start.x} ${start.y} A ${radius} ${radius} 0 0 1 ${end.x} ${end.y}`;
}

const styles = StyleSheet.create({
  readout: {
    alignItems: 'center',
    gap: 2,
    left: 0,
    position: 'absolute',
    right: 0,
    top: '62%',
  },
  tapHint: {
    alignItems: 'center',
    bottom: '20%',
    left: 0,
    position: 'absolute',
    right: 0,
  },
  value: {
    fontSize: 34,
    lineHeight: 36,
  },
});
