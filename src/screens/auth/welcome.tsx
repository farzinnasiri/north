import { Link } from 'expo-router';
import { useEffect, useState } from 'react';
import { Easing, Pressable, StyleSheet, View, useWindowDimensions } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withDelay,
  withTiming,
} from 'react-native-reanimated';

import { NorthButton } from '@/components/ui/north-button';
import { NorthScreen } from '@/components/ui/north-screen';
import { NorthText } from '@/components/ui/north-text';
import type { MascotScene } from '@/domains/mascot/mascot';
import { Mascot } from '@/domains/mascot/ui/mascot';
import { colors, motion, spacing, typography } from '@/theme';

let welcomeHasArrived = false;

type WelcomeAmbientKind = 'blink' | 'look-left' | 'look-right' | 'rest';

const WELCOME_AMBIENT_SEQUENCE: readonly {
  delay: number;
  duration: number;
  kind: Exclude<WelcomeAmbientKind, 'rest'>;
}[] = [
  { delay: 2200, duration: motion.quick, kind: 'blink' },
  { delay: 4100, duration: 720, kind: 'look-right' },
  { delay: 2900, duration: motion.quick, kind: 'blink' },
  { delay: 5400, duration: 680, kind: 'look-left' },
  { delay: 3300, duration: motion.quick, kind: 'blink' },
];

export function Welcome() {
  const { height, width } = useWindowDimensions();
  const reduceMotion = useReducedMotion();
  const compact = height < 740 || width < 360;
  const faceSize = Math.min(width - (compact ? 48 : 72), compact ? 224 : 292);
  const [arrives] = useState(() => !reduceMotion && !welcomeHasArrived);
  const [ambientCue, setAmbientCue] = useState(0);
  const [ambientKind, setAmbientKind] = useState<WelcomeAmbientKind>('rest');
  const faceOpacity = useSharedValue(arrives ? 0.18 : 1);
  const faceY = useSharedValue(arrives ? -20 : 0);
  const copyOpacity = useSharedValue(arrives ? 0 : 1);
  const copyY = useSharedValue(arrives ? 18 : 0);
  const actionsOpacity = useSharedValue(arrives ? 0 : 1);
  const actionsY = useSharedValue(arrives ? 14 : 0);

  useEffect(() => {
    welcomeHasArrived = true;
    if (!arrives) return;

    const timing = { duration: motion.arrival, easing: Easing.bezier(0.32, 0.72, 0, 1) };
    faceOpacity.value = withTiming(1, { duration: motion.settle });
    faceY.value = withTiming(0, timing);
    copyOpacity.value = withDelay(motion.settle, withTiming(1, { duration: motion.settle }));
    copyY.value = withDelay(motion.settle, withTiming(0, timing));
    actionsOpacity.value = withDelay(motion.arrival, withTiming(1, { duration: motion.settle }));
    actionsY.value = withDelay(motion.arrival, withTiming(0, timing));

  }, [
    actionsOpacity,
    actionsY,
    arrives,
    copyOpacity,
    copyY,
    faceOpacity,
    faceY,
  ]);

  useEffect(() => {
    if (reduceMotion) return;

    if (ambientCue >= WELCOME_AMBIENT_SEQUENCE.length) return;

    const moment = WELCOME_AMBIENT_SEQUENCE[ambientCue];
    const timer = setTimeout(() => {
      if (ambientKind === 'rest') {
        setAmbientKind(moment.kind);
        return;
      }

      setAmbientKind('rest');
      setAmbientCue((cue) => cue + 1);
    }, ambientKind === 'rest' ? moment.delay : moment.duration);

    return () => clearTimeout(timer);
  }, [ambientCue, ambientKind, reduceMotion]);

  const faceStyle = useAnimatedStyle(() => ({
    opacity: faceOpacity.value,
    transform: [{ translateY: faceY.value }],
  }));
  const copyStyle = useAnimatedStyle(() => ({
    opacity: copyOpacity.value,
    transform: [{ translateY: copyY.value }],
  }));
  const actionsStyle = useAnimatedStyle(() => ({
    opacity: actionsOpacity.value,
    transform: [{ translateY: actionsY.value }],
  }));
  const faceScene = welcomeFaceScene(ambientKind, ambientCue);

  return (
    <NorthScreen
      bounces={false}
      contentInsetAdjustmentBehavior="always"
      contentStyle={[styles.screen, compact && styles.screenCompact]}
    >
      <View style={styles.main}>
        <Animated.View
          accessibilityElementsHidden
          importantForAccessibility="no-hide-descendants"
          style={[styles.faceStage, compact && styles.faceStageCompact, faceStyle]}
        >
          <Mascot scene={faceScene} size={faceSize} />
        </Animated.View>

        <Animated.View style={[styles.copy, copyStyle]}>
          <NorthText style={[styles.definition, compact && styles.definitionCompact]}>
            North gives you one Action at a time and asks you to set the deadline.
          </NorthText>
        </Animated.View>
      </View>

      <Animated.View style={[styles.actions, compact && styles.actionsCompact, actionsStyle]}>
        <Link asChild href="/introduction">
          <NorthButton label="See how it works" style={styles.primaryAction} />
        </Link>
        <View style={styles.signInRow}>
          <NorthText style={styles.signInPrompt} variant="small">
            Already have an account?
          </NorthText>
          <Link asChild href="/sign-in">
            <Pressable accessibilityRole="link" style={styles.signInTarget}>
              <NorthText style={styles.signInLink} variant="small">SIGN IN</NorthText>
            </Pressable>
          </Link>
        </View>
      </Animated.View>
    </NorthScreen>
  );
}

function welcomeFaceScene(
  ambientKind: WelcomeAmbientKind,
  ambientCue: number,
): MascotScene {
  if (ambientKind === 'blink') {
    return {
      expression: 'focused',
      rotations: {
        cardinals: { angle: 0 },
        face: { angle: 0 },
        outer: { angle: 0 },
      },
      transition: { duration: 'quick', expression: 'acknowledge' },
    };
  }

  if (ambientKind === 'look-left' || ambientKind === 'look-right') {
    const direction = ambientKind === 'look-left' ? -1 : 1;
    return {
      expression: 'focused',
      gesture: {
        cue: `welcome-attention-${ambientCue}`,
        duration: 'settle',
        kind: direction < 0 ? 'orient-left' : 'orient-right',
      },
      rotations: {
        cardinals: { angle: direction * -2, duration: 'settle' },
        face: { angle: direction * 3, duration: 'settle' },
        outer: { angle: direction, duration: 'settle' },
      },
      transition: { duration: 'settle' },
    };
  }

  return {
    expression: 'focused',
    rotations: {
      cardinals: { angle: 0, duration: 'settle' },
      face: { angle: 0, duration: 'settle' },
      outer: { angle: 0, duration: 'settle' },
    },
    transition: { duration: 'settle' },
  };
}

const styles = StyleSheet.create({
  actions: {
    gap: spacing.md,
    marginTop: spacing.xxl,
  },
  actionsCompact: {
    gap: spacing.sm,
  },
  copy: {
    maxWidth: 360,
    paddingBottom: spacing.xl,
  },
  definition: {
    color: colors.paper,
    fontFamily: typography.sansMedium,
    fontSize: 27,
    lineHeight: 36,
  },
  definitionCompact: {
    fontSize: 23,
    lineHeight: 31,
  },
  faceStage: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
    minHeight: 300,
  },
  faceStageCompact: {
    minHeight: 232,
  },
  main: {
    flex: 1,
    justifyContent: 'space-between',
  },
  primaryAction: {
    minHeight: 54,
  },
  screen: {
    flexGrow: 1,
    minHeight: '100%',
    paddingBottom: spacing.xl,
    paddingTop: spacing.xl,
  },
  screenCompact: {
    gap: spacing.lg,
    paddingBottom: spacing.lg,
  },
  signInLink: {
    color: colors.paper,
    fontFamily: typography.sansMedium,
    textDecorationLine: 'underline',
  },
  signInPrompt: {
    color: colors.ash,
  },
  signInRow: {
    alignItems: 'baseline',
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    justifyContent: 'center',
    minHeight: 44,
    paddingVertical: spacing.md,
  },
  signInTarget: {
    justifyContent: 'center',
  },
});
