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

type CompassProps = {
  accent?: 'brass' | 'meridian';
  animate?: boolean;
  bearing?: number;
  fromBearing?: number;
  size?: number;
};

export function Compass({
  accent = 'brass',
  animate = false,
  bearing = 47,
  fromBearing = bearing,
  size = 176,
}: CompassProps) {
  const reduceMotion = useReducedMotion();
  const rotation = useSharedValue(animate ? fromBearing : bearing);
  const opacity = useSharedValue(1);
  const inset = Math.max(10, size * 0.08);
  const innerSize = size - inset * 2;
  const needleLength = size * 0.36;
  const accentColor = accent === 'brass' ? colors.brass : colors.meridianLight;

  useEffect(() => {
    if (!animate) {
      rotation.value = bearing;
      return;
    }
    if (reduceMotion) {
      opacity.value = 0;
      rotation.value = bearing;
      opacity.value = withTiming(1, { duration: motion.settle });
      return;
    }
    rotation.value = withSpring(bearing, {
      damping: motion.needleDamping,
      mass: motion.needleMass,
      overshootClamping: true,
      stiffness: motion.needleStiffness,
    });
  }, [animate, bearing, opacity, reduceMotion, rotation]);

  const animatedNeedle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ rotate: `${rotation.value}deg` }],
  }));

  return (
    <View
      accessibilityLabel={`Compass showing ${bearing} degrees from north`}
      accessibilityRole="image"
      style={[
        styles.outer,
        {
          borderRadius: size / 2,
          height: size,
          width: size,
        },
      ]}
    >
      <View
        style={[
          styles.inner,
          {
            borderRadius: innerSize / 2,
            height: innerSize,
            width: innerSize,
          },
        ]}
      />
      <NorthText style={[styles.north, { top: Math.max(7, size * 0.045) }]} variant="label">
        N
      </NorthText>
      <Animated.View
        style={[
          styles.needleAssembly,
          { height: needleLength * 2, width: 12 },
          animatedNeedle,
        ]}
      >
        <View
          style={[
            styles.northNeedle,
            { backgroundColor: accentColor, height: needleLength },
          ]}
        />
        <View
          style={[
            styles.southNeedle,
            { height: needleLength * 0.2, top: needleLength },
          ]}
        />
      </Animated.View>
      <View style={[styles.hub, { backgroundColor: accentColor }]} />
    </View>
  );
}

const styles = StyleSheet.create({
  hub: {
    borderRadius: 4,
    height: 7,
    position: 'absolute',
    width: 7,
  },
  inner: {
    borderColor: colors.lineSoft,
    borderWidth: 1,
  },
  needleAssembly: {
    alignItems: 'center',
    position: 'absolute',
  },
  north: {
    color: colors.slate,
    position: 'absolute',
  },
  northNeedle: {
    borderRadius: 2,
    position: 'absolute',
    top: 0,
    width: 2.5,
  },
  outer: {
    alignItems: 'center',
    alignSelf: 'center',
    borderColor: colors.line,
    borderWidth: 1,
    justifyContent: 'center',
  },
  southNeedle: {
    backgroundColor: colors.slate,
    borderRadius: 2,
    position: 'absolute',
    width: 2,
  },
});
