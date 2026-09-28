import type { StyleProp, ViewStyle } from 'react-native';
import { StyleSheet, View } from 'react-native';
import type { AnimatedStyle } from 'react-native-reanimated';
import Animated from 'react-native-reanimated';
import Svg, { Circle, Line, Path, Polygon } from 'react-native-svg';

import { colors } from '@/theme';

type NorthMarkProps = {
  needleStyle?: AnimatedStyle<ViewStyle>;
  showNeedle?: boolean;
  size?: number;
  style?: StyleProp<ViewStyle>;
};

function point(centre: number, radius: number, degrees: number) {
  const angle = (degrees * Math.PI) / 180;
  return {
    x: centre + radius * Math.cos(angle),
    y: centre + radius * Math.sin(angle),
  };
}

function arc(centre: number, radius: number, start: number, end: number) {
  const from = point(centre, radius, start);
  const to = point(centre, radius, end);
  return `M ${from.x} ${from.y} A ${radius} ${radius} 0 ${end - start > 180 ? 1 : 0} 1 ${to.x} ${to.y}`;
}

/**
 * North's signal mark. The broken gate is the world around the person; the
 * red needle is the one direction through it. The independent needle layer
 * lets the rare boot reveal and the live compass share one physical motion.
 */
export function NorthMark({
  needleStyle,
  showNeedle = true,
  size = 96,
  style,
}: NorthMarkProps) {
  const centre = size / 2;
  const outer = size * 0.445;
  const inner = size * 0.365;
  const needle = size * 0.34;
  const half = Math.max(2.5, size * 0.026);
  const stroke = Math.max(1, size * 0.009);
  const hub = Math.max(3.5, size * 0.032);

  return (
    <View
      accessibilityLabel="North"
      accessibilityRole="image"
      style={[styles.mark, { height: size, width: size }, style]}
    >
      <Svg height={size} style={styles.layer} width={size}>
        <Path
          d={arc(centre, outer, -62, 62)}
          fill="none"
          stroke={colors.line}
          strokeLinecap="round"
          strokeWidth={stroke}
        />
        <Path
          d={arc(centre, outer, 118, 242)}
          fill="none"
          stroke={colors.line}
          strokeLinecap="round"
          strokeWidth={stroke}
        />
        <Path
          d={arc(centre, inner, -48, 48)}
          fill="none"
          stroke={colors.lineSoft}
          strokeLinecap="round"
          strokeWidth={stroke}
        />
        <Path
          d={arc(centre, inner, 132, 228)}
          fill="none"
          stroke={colors.lineSoft}
          strokeLinecap="round"
          strokeWidth={stroke}
        />
        <Line
          stroke={colors.line}
          strokeWidth={stroke}
          x1={centre}
          x2={centre}
          y1={size * 0.018}
          y2={size * 0.105}
        />
        <Line
          stroke={colors.lineSoft}
          strokeWidth={stroke}
          x1={centre}
          x2={centre}
          y1={size * 0.895}
          y2={size * 0.982}
        />
        <Circle
          cx={centre}
          cy={centre}
          fill={colors.fieldDeep}
          r={hub}
          stroke={colors.ash}
          strokeWidth={Math.max(1, stroke * 0.65)}
        />
        <Circle cx={centre} cy={centre} fill={colors.brass} r={Math.max(1.5, hub * 0.38)} />
      </Svg>

      {showNeedle ? (
        <Animated.View style={[styles.layer, styles.noPointerEvents, needleStyle]}>
          <Svg height={size} width={size}>
            <Polygon
              fill={colors.brass}
              points={`${centre},${centre - needle} ${centre - half},${centre} ${centre + half},${centre}`}
            />
            <Polygon
              fill={colors.line}
              points={`${centre},${centre + needle * 0.34} ${centre - half},${centre} ${centre + half},${centre}`}
            />
            <Circle cx={centre} cy={centre} fill={colors.fieldDeep} r={hub * 0.75} />
            <Circle cx={centre} cy={centre} fill={colors.brass} r={Math.max(1.5, hub * 0.38)} />
          </Svg>
        </Animated.View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  layer: {
    bottom: 0,
    left: 0,
    position: 'absolute',
    right: 0,
    top: 0,
  },
  mark: {
    position: 'relative',
  },
  noPointerEvents: {
    pointerEvents: 'none',
  },
});
