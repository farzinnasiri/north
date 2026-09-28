import { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';

import { NorthText } from '@/components/ui/north-text';
import { colors, motion } from '@/theme';

const TICKS = Array.from({ length: 24 }, (_, index) => index);

type CompassProps = {
  accent?: 'brass' | 'meridian';
  animate?: boolean;
  direction?: number;
  fromDirection?: number;
  inverted?: boolean;
  size?: number;
};

export function Compass({
  accent = 'brass',
  animate = false,
  direction = 47,
  fromDirection = direction,
  inverted = false,
  size = 176,
}: CompassProps) {
  const reduceMotion = useReducedMotion();
  const rotation = useSharedValue(animate ? fromDirection : direction);
  const opacity = useSharedValue(1);
  const inset = Math.max(16, size * 0.095);
  const innerSize = size - inset * 2;
  const needleLength = size * 0.34;
  const accentColor = accent === 'brass' ? colors.brass : colors.meridianLight;
  const outerLine = inverted ? colors.line : colors.lineSoft;
  const innerLine = colors.lineSoft;
  const secondary = inverted ? colors.ash : colors.slate;

  useEffect(() => {
    if (!animate) {
      rotation.value = direction;
      return;
    }
    if (reduceMotion) {
      opacity.value = 0;
      rotation.value = direction;
      opacity.value = withTiming(1, { duration: motion.settle });
      return;
    }
    rotation.value = withSpring(direction, {
      damping: motion.needleDamping,
      mass: motion.needleMass,
      overshootClamping: true,
      stiffness: motion.needleStiffness,
    });
  }, [animate, direction, opacity, reduceMotion, rotation]);

  const animatedNeedle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ rotate: `${rotation.value}deg` }],
  }));

  return (
    <View
      accessibilityLabel={`Compass showing ${direction} degrees from north`}
      accessibilityRole="image"
      style={[
        styles.outer,
        {
          backgroundColor: colors.fieldRaised,
          borderColor: outerLine,
          borderRadius: size / 2,
          height: size,
          width: size,
        },
      ]}
    >
      {TICKS.map((index) => (
        <View
          key={index}
          style={[
            styles.tickAxis,
            { height: size, transform: [{ rotate: `${index * 15}deg` }] },
          ]}
        >
          <View
            style={[
              styles.tick,
              {
                backgroundColor: index === 0 ? accentColor : secondary,
                height: index % 3 === 0 ? size * 0.045 : size * 0.025,
                top: size * 0.025,
                width: index % 3 === 0 ? 3 : 1.5,
              },
            ]}
          />
        </View>
      ))}
      <View
        style={[
          styles.inner,
          {
            backgroundColor: colors.fieldDeep,
            borderColor: innerLine,
            borderRadius: innerSize / 2,
            height: innerSize,
            width: innerSize,
          },
        ]}
      />
      <NorthText
        style={[styles.north, { color: accentColor, top: Math.max(12, size * 0.052) }]}
        variant="label"
      >
        N
      </NorthText>
      <NorthText style={[styles.east, { color: secondary, right: size * 0.06 }]} variant="label">
        E
      </NorthText>
      <NorthText style={[styles.south, { bottom: size * 0.052, color: secondary }]} variant="label">
        S
      </NorthText>
      <NorthText style={[styles.west, { color: secondary, left: size * 0.06 }]} variant="label">
        W
      </NorthText>
      <Animated.View
        style={[
          styles.needleAssembly,
          { height: needleLength * 2, width: Math.max(22, size * 0.075) },
          animatedNeedle,
        ]}
      >
        <View
          style={[
            styles.northNeedle,
            {
              borderBottomColor: accentColor,
              borderBottomWidth: needleLength,
              borderLeftWidth: Math.max(7, size * 0.025),
              borderRightWidth: Math.max(7, size * 0.025),
            },
          ]}
        />
        <View
          style={[
            styles.southNeedle,
            {
              borderLeftWidth: Math.max(5, size * 0.018),
              borderRightWidth: Math.max(5, size * 0.018),
              borderTopColor: secondary,
              borderTopWidth: needleLength * 0.34,
              top: needleLength,
            },
          ]}
        />
      </Animated.View>
      <View style={[styles.hub, { borderColor: accentColor }]}>
        <View style={styles.hubCore} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  hub: {
    alignItems: 'center',
    backgroundColor: colors.field,
    borderRadius: 15,
    borderWidth: 2,
    height: 26,
    justifyContent: 'center',
    position: 'absolute',
    width: 26,
  },
  hubCore: {
    backgroundColor: colors.paper,
    borderRadius: 4,
    height: 7,
    width: 7,
  },
  inner: {
    position: 'absolute',
    borderWidth: 1,
  },
  needleAssembly: {
    alignItems: 'center',
    position: 'absolute',
  },
  north: {
    position: 'absolute',
    zIndex: 2,
  },
  northNeedle: {
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    height: 0,
    position: 'absolute',
    top: 0,
    width: 0,
  },
  outer: {
    alignItems: 'center',
    alignSelf: 'center',
    borderWidth: 2,
    justifyContent: 'center',
    shadowColor: colors.fieldDeep,
    shadowOffset: { height: 18, width: 0 },
    shadowOpacity: 0.7,
    shadowRadius: 24,
  },
  southNeedle: {
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    height: 0,
    position: 'absolute',
    width: 0,
  },
  east: {
    marginTop: -7,
    position: 'absolute',
    top: '50%',
    zIndex: 2,
  },
  south: {
    position: 'absolute',
    zIndex: 2,
  },
  tick: {
    position: 'absolute',
  },
  tickAxis: {
    alignItems: 'center',
    position: 'absolute',
    top: 0,
    width: 4,
  },
  west: {
    marginTop: -7,
    position: 'absolute',
    top: '50%',
    zIndex: 2,
  },
});
