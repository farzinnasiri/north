import { View } from 'react-native';
import Svg, { Circle, Line, Polygon } from 'react-native-svg';

import { colors } from '@/theme';

type NorthMarkProps = {
  size?: number;
};

/**
 * The product mark: the compass reduced to the one thing it is for. It is
 * drawn rather than shipped as an image so it stays sharp at any size and
 * inherits the palette, and it never animates — North is already there when
 * you look at it.
 */
export function NorthMark({ size = 96 }: NorthMarkProps) {
  const centre = size / 2;
  const rim = centre - 1;
  const needle = size * 0.34;

  return (
    <View accessibilityLabel="North" accessibilityRole="image">
      <Svg height={size} width={size}>
        <Circle
          cx={centre}
          cy={centre}
          fill="none"
          r={rim}
          stroke={colors.line}
          strokeWidth={1}
        />
        <Circle
          cx={centre}
          cy={centre}
          fill="none"
          r={rim - size * 0.09}
          stroke={colors.lineSoft}
          strokeWidth={1}
        />
        <Line
          stroke={colors.line}
          strokeWidth={1}
          x1={centre}
          x2={centre}
          y1={size * 0.06}
          y2={size * 0.13}
        />
        <Polygon
          fill={colors.brass}
          points={`${centre},${centre - needle} ${centre - 3},${centre} ${centre + 3},${centre}`}
        />
        <Polygon
          fill={colors.line}
          points={`${centre},${centre + needle * 0.3} ${centre - 3},${centre} ${centre + 3},${centre}`}
        />
        <Circle cx={centre} cy={centre} fill={colors.fieldDeep} r={3.5} stroke={colors.ash} strokeWidth={1} />
      </Svg>
    </View>
  );
}
