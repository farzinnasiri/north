import type { StyleProp, ViewStyle } from 'react-native';
import { StyleSheet, useWindowDimensions, View } from 'react-native';
import Svg, { Circle, Defs, Line, Pattern, RadialGradient, Rect, Stop } from 'react-native-svg';

import { useSignalTheme } from '@/components/ui/signal-theme';
import { colors } from '@/theme';

type NorthBackdropProps = {
  /** The crosshair grid. Off where the Compass draws its own. */
  grid?: boolean;
  style?: StyleProp<ViewStyle>;
};

/**
 * The field everything sits on: true black, a 20-point crosshair grid, and two
 * faint signal glows. The glows are there for the glass: Liquid Glass over
 * pure black has nothing to bend, so it would read as a grey box.
 */
export function NorthBackdrop({ grid = true, style }: NorthBackdropProps) {
  const { height, width } = useWindowDimensions();
  const signal = useSignalTheme();
  return (
    <View pointerEvents="none" style={[StyleSheet.absoluteFill, styles.field, style]}>
      <Svg height={height} width={width}>
        <Defs>
          <Pattern height="20" id="north-crosshair" patternUnits="userSpaceOnUse" width="20">
            <Line stroke={colors.lineSoft} strokeWidth="1" x1="7" x2="13" y1="10" y2="10" />
            <Line stroke={colors.lineSoft} strokeWidth="1" x1="10" x2="10" y1="7" y2="13" />
          </Pattern>
          <RadialGradient cx="50%" cy="50%" id="north-glow-top" r="50%">
            <Stop offset="0" stopColor={signal.primary} stopOpacity="0.22" />
            <Stop offset="1" stopColor={signal.primary} stopOpacity="0" />
          </RadialGradient>
          <RadialGradient cx="50%" cy="50%" id="north-glow-low" r="50%">
            <Stop offset="0" stopColor={signal.light} stopOpacity="0.1" />
            <Stop offset="1" stopColor={signal.light} stopOpacity="0" />
          </RadialGradient>
        </Defs>
        {grid ? <Rect fill="url(#north-crosshair)" height={height} width={width} /> : null}
        <Circle cx={width * 0.5} cy={height * 0.26} fill="url(#north-glow-top)" r={width * 0.72} />
        <Circle cx={width * 0.1} cy={height * 0.86} fill="url(#north-glow-low)" r={width * 0.8} />
      </Svg>
    </View>
  );
}

const styles = StyleSheet.create({
  field: {
    backgroundColor: colors.fieldDeep,
  },
});
