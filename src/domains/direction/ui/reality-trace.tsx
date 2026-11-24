import { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import Svg, { Circle, Line, Polygon, Text as SvgText } from 'react-native-svg';

import { NorthText } from '@/components/ui/north-text';
import type { Axis, AxisReading } from '@/domains/direction/initial-direction';
import { realityBand } from '@/domains/direction/initial-direction';
import { colors, spacing, typography } from '@/theme';

const SIZE = 300;
const CENTRE = SIZE / 2;
const RADIUS = 96;
const LABEL_RADIUS = 132;
const AXES: Axis[] = ['agency', 'desire', 'connection', 'appetite', 'craft', 'frame'];
const LABELS: Record<Axis, string> = {
  agency: 'AGENCY',
  appetite: 'SELF-COMMAND',
  connection: 'CONNECTION',
  craft: 'CRAFT',
  desire: 'DESIRE',
  frame: 'FRAME',
};
const DETAILS: Record<Axis, string> = {
  agency: 'Whether your choices feel like yours.',
  appetite: 'Whether you govern what takes your time and attention.',
  connection: 'Whether you initiate and maintain bonds.',
  craft: 'What you have built in skill and body.',
  desire: 'Whether you move toward what you want.',
  frame: 'Whether you hold your position under pressure.',
};
const AXIS_COLORS: Record<Axis, string> = {
  agency: colors.axisAgency,
  appetite: colors.axisAppetite,
  connection: colors.axisConnection,
  craft: colors.axisCraft,
  desire: colors.axisDesire,
  frame: colors.axisFrame,
};

type Point = { x: number; y: number };

/** The six onboarding readings as one calibration trace, not six score cards. */
export function RealityTrace({ readings }: { readings: AxisReading[] }) {
  const byAxis = new Map(readings.map((reading) => [reading.axis, reading.off]));
  const [selected, setSelected] = useState<Axis>(() => furthestAxis(readings));
  const points = AXES.map((axis, index) => point(index, (byAxis.get(axis) ?? 0) / 100));

  return (
    <View style={styles.root}>
      <View style={styles.graph}>
        <Svg height="100%" viewBox={`0 0 ${SIZE} ${SIZE}`} width="100%">
        {[0.25, 0.5, 0.75, 1].map((scale) => (
          <Polygon
            fill="none"
            key={scale}
            points={AXES.map((_, index) => point(index, scale)).map(formatPoint).join(' ')}
            stroke={scale === 1 ? colors.line : colors.lineSoft}
            strokeWidth={scale === 1 ? 1.2 : 0.8}
          />
        ))}

        {AXES.map((axis, index) => {
          const edge = point(index, 1);
          return (
            <Line
              key={axis}
              stroke={AXIS_COLORS[axis]}
              strokeOpacity="0.42"
              strokeWidth="0.8"
              x1={CENTRE}
              x2={edge.x}
              y1={CENTRE}
              y2={edge.y}
            />
          );
        })}

        <Polygon
          fill={colors.meridian}
          fillOpacity="0.08"
          points={points.map(formatPoint).join(' ')}
          stroke={colors.meridian}
          strokeLinejoin="round"
          strokeWidth="1.8"
        />

        {points.map((value, index) => {
          const axis = AXES[index];
          const active = selected === axis;
          return (
            <Circle
              cx={value.x}
              cy={value.y}
              fill={AXIS_COLORS[axis]}
              key={axis}
              r={active ? 5 : 4}
              stroke={active ? AXIS_COLORS[axis] : colors.fieldDeep}
              strokeOpacity={active ? 0.48 : 1}
              strokeWidth={active ? 6 : 1.5}
            />
          );
        })}

        {AXES.map((axis, index) => {
          const label = labelPoint(index);
          return (
            <SvgText
              fill={AXIS_COLORS[axis]}
              fontFamily={typography.monoMedium}
              fontSize={selected === axis ? 12 : 11}
              key={axis}
              letterSpacing="0.6"
              textAnchor={label.anchor}
              x={label.x}
              y={label.y}
            >
              {LABELS[axis]}
            </SvgText>
          );
        })}
        </Svg>

        {AXES.map((axis, index) => {
          const label = labelPoint(index);
          return (
            <Pressable
              accessibilityHint="Select to inspect this reading"
              accessibilityLabel={`${LABELS[axis]}, ${realityBand(byAxis.get(axis) ?? 0)}`}
              accessibilityRole="button"
              accessibilityState={{ selected: selected === axis }}
              key={axis}
              onPress={() => setSelected(axis)}
              style={[
                styles.hitTarget,
                {
                  left: `${(label.x / SIZE) * 100}%`,
                  top: `${(label.y / SIZE) * 100}%`,
                },
              ]}
            />
          );
        })}
      </View>

      <View style={styles.detail}>
        <View style={styles.detailCopy}>
          <NorthText style={{ color: AXIS_COLORS[selected] }} variant="label">
            {LABELS[selected]}
          </NorthText>
          <NorthText variant="small">{DETAILS[selected]}</NorthText>
        </View>
        <NorthText style={[styles.band, { color: AXIS_COLORS[selected] }]} variant="label">
          {realityBand(byAxis.get(selected) ?? 0).toUpperCase()}
        </NorthText>
      </View>
    </View>
  );
}

function furthestAxis(readings: AxisReading[]): Axis {
  let furthest = AXES[0];
  let distance = -1;
  for (const reading of readings) {
    if (reading.off <= distance) continue;
    furthest = reading.axis;
    distance = reading.off;
  }
  return furthest;
}

function point(index: number, scale: number): Point {
  const angle = -Math.PI / 2 + index * (Math.PI / 3);
  return {
    x: CENTRE + Math.cos(angle) * RADIUS * Math.min(1, Math.max(0, scale)),
    y: CENTRE + Math.sin(angle) * RADIUS * Math.min(1, Math.max(0, scale)),
  };
}

function formatPoint(value: Point): string {
  return `${value.x},${value.y}`;
}

function labelPoint(index: number): Point & { anchor: 'end' | 'middle' | 'start' } {
  const angle = -Math.PI / 2 + index * (Math.PI / 3);
  const cosine = Math.cos(angle);
  return {
    anchor: cosine > 0.3 ? 'end' : cosine < -0.3 ? 'start' : 'middle',
    x: CENTRE + cosine * LABEL_RADIUS,
    y: CENTRE + Math.sin(angle) * LABEL_RADIUS + 3,
  };
}

const styles = StyleSheet.create({
  band: {
    fontSize: 12,
  },
  detail: {
    borderTopColor: colors.glassEdge,
    borderTopWidth: StyleSheet.hairlineWidth,
    gap: spacing.sm,
    minHeight: 52,
    paddingTop: spacing.sm,
  },
  detailCopy: {
    flex: 1,
    gap: 2,
  },
  graph: {
    alignSelf: 'center',
    aspectRatio: 1,
    maxWidth: 300,
    width: '100%',
  },
  hitTarget: {
    height: 48,
    marginLeft: -36,
    marginTop: -24,
    position: 'absolute',
    width: 72,
  },
  root: {
    gap: spacing.sm,
  },
});
