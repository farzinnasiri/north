import { useEffect, useRef } from 'react';
import type { StyleProp, ViewStyle } from 'react-native';
import { StyleSheet, View } from 'react-native';
import Animated, {
  Easing,
  cancelAnimation,
  useAnimatedProps,
  useAnimatedStyle,
  useDerivedValue,
  useReducedMotion,
  useSharedValue,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import Svg, { Circle, G, Line, Path, Text as SvgText } from 'react-native-svg';

import { useSignalTheme } from '@/components/ui/signal-theme';
import type {
  MascotDuration,
  MascotExpressionTransition,
  MascotScene,
  MascotTiming,
} from '@/domains/mascot/mascot';
import {
  ACKNOWLEDGEMENT_LEFT,
  ACKNOWLEDGEMENT_RIGHT,
  eyePath,
  eyeTargetFor,
  morphPoints,
  morphValue,
} from '@/domains/mascot/mascot-shapes';
import { colors, motion, typography } from '@/theme';

const AnimatedPath = Animated.createAnimatedComponent(Path);
const AnimatedG = Animated.createAnimatedComponent(G);
const CENTRE = 130;

function durationMs(duration: MascotTiming | undefined, fallback: MascotDuration): number {
  return typeof duration === 'number' ? duration : motion[duration ?? fallback];
}

function transitionFor(
  requested: MascotExpressionTransition | undefined,
  expression: MascotScene['expression'],
): Exclude<MascotExpressionTransition, 'default'> {
  if (!requested || requested === 'default') {
    return expression === 'proud' ? 'acknowledge' : 'morph';
  }
  return requested;
}

function sceneLabel(scene: MascotScene): string {
  return scene.expression === 'compass'
    ? `Mascot showing a direction of ${Math.round(scene.direction ?? 0)} degrees.`
    : `Mascot expression: ${scene.expression}.`;
}

export type MascotProps = {
  scene: MascotScene;
  size?: number;
  /** Layout placement only. Body transforms remain owned by the mascot. */
  style?: StyleProp<ViewStyle>;
  testID?: string;
};

/**
 * Product-owned rendering for the mascot. Its scene interface is declarative:
 * callers describe the destination while this module owns interpolation,
 * interruption, motion tokens, reduced motion, and SVG geometry.
 */
export function Mascot({ scene, size = 96, style, testID }: MascotProps) {
  const reduceMotion = useReducedMotion();
  const signal = useSignalTheme();
  const target = eyeTargetFor(scene.expression, scene.direction ?? 0);

  const expressionProgress = useSharedValue(1);
  const fromCurve = useSharedValue(target.curve);
  const fromLeft = useSharedValue(target.left);
  const fromRight = useSharedValue(target.right);
  const throughAcknowledgement = useSharedValue(0);
  const toCurve = useSharedValue(target.curve);
  const toLeft = useSharedValue(target.left);
  const toRight = useSharedValue(target.right);
  const viaCurve = useSharedValue(target.curve);
  const viaLeft = useSharedValue(target.left);
  const viaRight = useSharedValue(target.right);

  const outerAngle = useSharedValue(scene.rotations?.outer?.angle ?? 0);
  const cardinalAngle = useSharedValue(scene.rotations?.cardinals?.angle ?? 0);
  const faceAngle = useSharedValue(scene.rotations?.face?.angle ?? 0);
  const bodyX = useSharedValue(0);
  const bodyY = useSharedValue(0);
  const bodyScale = useSharedValue(1);
  const bodyOpacity = useSharedValue(1);
  const mountedExpression = useRef(false);
  const mountedGesture = useRef(false);
  const gestureCue = scene.gesture?.cue;
  const gestureDuration = scene.gesture?.duration;
  const gestureKind = scene.gesture?.kind;

  useEffect(() => {
    const next = eyeTargetFor(scene.expression, scene.direction ?? 0);
    if (!mountedExpression.current) {
      mountedExpression.current = true;
      return;
    }

    // Interrupted transitions hand their rendered shape to the next one.
    fromCurve.value = morphValue(
      fromCurve.value,
      viaCurve.value,
      toCurve.value,
      expressionProgress.value,
      throughAcknowledgement.value,
    );
    fromLeft.value = morphPoints(
      fromLeft.value,
      viaLeft.value,
      toLeft.value,
      expressionProgress.value,
      throughAcknowledgement.value,
    );
    fromRight.value = morphPoints(
      fromRight.value,
      viaRight.value,
      toRight.value,
      expressionProgress.value,
      throughAcknowledgement.value,
    );

    const transition = transitionFor(scene.transition?.expression, scene.expression);
    throughAcknowledgement.value = transition === 'acknowledge' ? 1 : 0;
    toCurve.value = next.curve;
    toLeft.value = next.left;
    toRight.value = next.right;
    viaCurve.value = 0;
    viaLeft.value = ACKNOWLEDGEMENT_LEFT;
    viaRight.value = ACKNOWLEDGEMENT_RIGHT;
    expressionProgress.value = 0;
    expressionProgress.value = withTiming(1, {
      duration: reduceMotion || transition === 'immediate'
        ? 0
        : durationMs(scene.transition?.duration, 'settle'),
      easing: Easing.bezier(0.32, 0.72, 0, 1),
    });
  }, [
    expressionProgress,
    fromCurve,
    fromLeft,
    fromRight,
    reduceMotion,
    scene.direction,
    scene.expression,
    scene.transition?.duration,
    scene.transition?.expression,
    throughAcknowledgement,
    toCurve,
    toLeft,
    toRight,
    viaCurve,
    viaLeft,
    viaRight,
  ]);

  useEffect(() => {
    const curve = Easing.bezier(0.32, 0.72, 0, 1);
    const animate = (
      value: typeof outerAngle,
      angle: number,
      duration: MascotTiming | undefined,
    ) => {
      value.value = withTiming(angle, {
        duration: reduceMotion ? 0 : durationMs(duration, 'quick'),
        easing: curve,
      });
    };

    animate(outerAngle, scene.rotations?.outer?.angle ?? 0, scene.rotations?.outer?.duration);
    animate(
      cardinalAngle,
      scene.rotations?.cardinals?.angle ?? 0,
      scene.rotations?.cardinals?.duration,
    );
    animate(faceAngle, scene.rotations?.face?.angle ?? 0, scene.rotations?.face?.duration);
  }, [
    cardinalAngle,
    faceAngle,
    outerAngle,
    reduceMotion,
    scene.rotations?.cardinals?.angle,
    scene.rotations?.cardinals?.duration,
    scene.rotations?.face?.angle,
    scene.rotations?.face?.duration,
    scene.rotations?.outer?.angle,
    scene.rotations?.outer?.duration,
  ]);

  useEffect(() => {
    const firstMount = !mountedGesture.current;
    if (firstMount) {
      mountedGesture.current = true;
      if (gestureKind !== 'arrive') return;
    }
    cancelAnimation(bodyX);
    cancelAnimation(bodyY);
    cancelAnimation(bodyScale);
    cancelAnimation(bodyOpacity);
    bodyX.value = 0;
    bodyY.value = 0;
    bodyScale.value = 1;
    bodyOpacity.value = 1;
    if (!gestureKind || reduceMotion) return;

    const total = durationMs(gestureDuration, 'settle');
    const out = Math.round(total * 0.42);
    const back = total - out;
    const timing = (value: number, duration: number) => withTiming(value, {
      duration,
      easing: Easing.bezier(0.32, 0.72, 0, 1),
    });

    if (gestureKind === 'arrive') {
      bodyY.value = 18;
      bodyScale.value = 0.96;
      bodyOpacity.value = 0;
      bodyY.value = timing(0, total);
      bodyScale.value = timing(1, total);
      bodyOpacity.value = timing(1, total);
    } else if (gestureKind === 'acknowledge') {
      bodyY.value = withSequence(timing(3, out), timing(0, back));
      bodyScale.value = withSequence(timing(0.99, out), timing(1, back));
    } else {
      const offset = gestureKind === 'orient-left' ? -4 : 4;
      bodyX.value = withSequence(timing(offset, out), timing(0, back));
    }
  }, [
    bodyScale,
    bodyOpacity,
    bodyX,
    bodyY,
    reduceMotion,
    gestureCue,
    gestureDuration,
    gestureKind,
  ]);

  const left = useDerivedValue(() => morphPoints(
    fromLeft.value,
    viaLeft.value,
    toLeft.value,
    expressionProgress.value,
    throughAcknowledgement.value,
  ));
  const right = useDerivedValue(() => morphPoints(
    fromRight.value,
    viaRight.value,
    toRight.value,
    expressionProgress.value,
    throughAcknowledgement.value,
  ));
  const curve = useDerivedValue(() => morphValue(
    fromCurve.value,
    viaCurve.value,
    toCurve.value,
    expressionProgress.value,
    throughAcknowledgement.value,
  ));

  const leftProps = useAnimatedProps(() => ({ d: eyePath(left.value, curve.value) }));
  const rightProps = useAnimatedProps(() => ({ d: eyePath(right.value, curve.value) }));
  const outerProps = useAnimatedProps(() => ({
    transform: `rotate(${outerAngle.value} ${CENTRE} ${CENTRE})`,
  }));
  const cardinalProps = useAnimatedProps(() => ({
    transform: `rotate(${cardinalAngle.value} ${CENTRE} ${CENTRE})`,
  }));
  const faceProps = useAnimatedProps(() => ({
    transform: `rotate(${faceAngle.value} ${CENTRE} ${CENTRE})`,
  }));
  const bodyStyle = useAnimatedStyle(() => ({
    opacity: bodyOpacity.value,
    transform: [
      { translateX: bodyX.value },
      { translateY: bodyY.value },
      { scale: bodyScale.value },
    ],
  }));

  const completion = Math.max(0, Math.min(1, scene.completion ?? 0));
  const faceFill = colors.paper;

  return (
    <View
      accessibilityLabel={sceneLabel(scene)}
      accessibilityRole="image"
      accessible
      style={[styles.placement, { height: size, width: size }, style]}
      testID={testID}
    >
      <Animated.View style={[styles.body, bodyStyle]}>
        <Svg height={size} viewBox="0 0 260 260" width={size}>
          <AnimatedG animatedProps={outerProps}>
            <Circle
              cx={CENTRE}
              cy={CENTRE}
              fill={colors.field}
              r={108}
              stroke={colors.line}
              strokeWidth={1}
            />
            {Array.from({ length: 24 }, (_, index) => {
              const cardinal = index % 6 === 0;
              const major = index % 2 === 0;
              const inscribed = index < Math.round(completion * 24);
              return (
                <Line
                  key={index}
                  stroke={inscribed ? colors.paper : cardinal ? signal.muted : colors.slate}
                  strokeWidth={inscribed || cardinal ? 2 : 1}
                  transform={`rotate(${index * 15} ${CENTRE} ${CENTRE})`}
                  x1={CENTRE}
                  x2={CENTRE}
                  y1={23}
                  y2={cardinal ? 33 : major ? 31 : 28}
                />
              );
            })}
            {scene.expression === 'compass' ? (
              <G transform={`rotate(${scene.direction ?? 0} ${CENTRE} ${CENTRE})`}>
                <Path d="M 130 18 L 138 33 L 130 42 L 122 33 Z" fill={signal.primary} />
                <Circle cx={CENTRE} cy="42" fill={colors.paper} r="2.5" />
              </G>
            ) : null}
          </AnimatedG>

          <AnimatedG animatedProps={cardinalProps}>
            <Circle
              cx={CENTRE}
              cy={CENTRE}
              fill={colors.fieldDeep}
              r={96}
              stroke={colors.lineSoft}
              strokeWidth={1}
            />
            <G fill={colors.ash} fontFamily={typography.monoMedium} fontSize={9} textAnchor="middle">
              <SvgText fill={signal.primary} x={130} y={44}>N</SvgText>
              <SvgText x={220} y={133}>E</SvgText>
              <SvgText x={130} y={222}>S</SvgText>
              <SvgText x={40} y={133}>W</SvgText>
            </G>
          </AnimatedG>

          <AnimatedG animatedProps={faceProps}>
            <Circle
              cx={CENTRE}
              cy={CENTRE}
              fill={colors.fieldDeep}
              r={84}
              stroke={colors.lineSoft}
              strokeWidth={1}
            />
            <AnimatedPath animatedProps={leftProps} fill={faceFill} />
            <AnimatedPath animatedProps={rightProps} fill={faceFill} />
          </AnimatedG>
        </Svg>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  body: {
    bottom: 0,
    left: 0,
    position: 'absolute',
    right: 0,
    top: 0,
  },
  placement: {
    alignSelf: 'center',
  },
});
