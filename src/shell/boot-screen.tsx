import { StyleSheet } from 'react-native';
import Animated, { useReducedMotion } from 'react-native-reanimated';

import { NorthMark } from '@/components/ui/north-mark';
import { colors, motion } from '@/theme';

type BootScreenProps = {
  /** Turns false once the app behind it is ready to be looked at. */
  held: boolean;
};

/**
 * The handoff from the system splash to the app. It is the same field as the
 * splash, so nothing flashes: the mark is simply there, holds while the app
 * gets ready, and then gets out of the way.
 *
 * It does not spin, pulse, or count. A loading indicator here would be the
 * first promise North broke — the product's whole claim is that it is already
 * there when you look at it.
 */
export function BootScreen({ held }: BootScreenProps) {
  const reduceMotion = useReducedMotion();

  return (
    <Animated.View
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
      style={[
        styles.screen,
        {
          opacity: held ? 1 : 0,
          transitionDuration: reduceMotion ? 0 : motion.settle,
          transitionProperty: ['opacity'],
          transitionTimingFunction: motion.easingStandard,
        },
      ]}
    >
      {/* The same mark, at the same size and position as the native splash's
          image, so the handoff between them is not a jump. */}
      <NorthMark size={168} />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  screen: {
    alignItems: 'center',
    backgroundColor: colors.fieldDeep,
    bottom: 0,
    justifyContent: 'center',
    left: 0,
    pointerEvents: 'none',
    position: 'absolute',
    right: 0,
    top: 0,
    zIndex: 10,
  },
});
