import { useEffect, useMemo, useRef, useState } from "react";
import { Alert, Pressable, StyleSheet, View } from "react-native";
import Animated, {
  Easing,
  Extrapolation,
  interpolate,
  useAnimatedProps,
  useReducedMotion,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import type { SharedValue } from "react-native-reanimated";
import Svg, { Circle, Line, Polygon, Text as SvgText } from "react-native-svg";

import type { Axis, AxisReading } from "@/domains/direction/initial-direction";
import { realityBand } from "@/domains/direction/initial-direction";
import { saveRealityCard } from "@/platform/reality-card-actions";
import { OnboardingFrame } from "@/screens/onboarding/onboarding-frame";
import { colors, radii, spacing, typography } from "@/theme";

const SIZE = 360;
const CENTRE = SIZE / 2;
const RADIUS = 92;
const LABEL_RADIUS = 132;
const AXES: readonly Axis[] = [
  "agency",
  "desire",
  "connection",
  "appetite",
  "craft",
  "frame",
];
const LABELS: Record<Axis, string> = {
  agency: "AGENCY",
  appetite: "SELF-COMMAND",
  connection: "CONNECTION",
  craft: "CRAFT",
  desire: "DESIRE",
  frame: "FRAME",
};
const AXIS_COLORS: Record<Axis, string> = {
  agency: colors.axisAgency,
  appetite: colors.axisAppetite,
  connection: colors.axisConnection,
  craft: colors.axisCraft,
  desire: colors.axisDesire,
  frame: colors.axisFrame,
};
const AnimatedCircle = Animated.createAnimatedComponent(Circle);
const AnimatedPolygon = Animated.createAnimatedComponent(Polygon);

type RealityRevealProps = {
  onContinue: () => void;
  readings: AxisReading[];
};

type Point = { x: number; y: number };

/** One authored calibration: the answers resolve into the person's six-axis Reality. */
export function RealityReveal({ onContinue, readings }: RealityRevealProps) {
  const cardRef = useRef<View>(null);
  const reduceMotion = useReducedMotion();
  const progress = useSharedValue(reduceMotion ? 1 : 0);
  const [saving, setSaving] = useState(false);
  const byAxis = useMemo(
    () => new Map(readings.map((reading) => [reading.axis, reading.off])),
    [readings],
  );
  const ordered = AXES.map((axis) => byAxis.get(axis) ?? 0);
  useEffect(() => {
    progress.set(
      withTiming(1, {
        duration: reduceMotion ? 0 : 760,
        easing: Easing.bezier(0.23, 1, 0.32, 1),
      }),
    );
  }, [progress, reduceMotion]);

  async function save() {
    if (saving) return;
    setSaving(true);
    try {
      const result = await saveRealityCard(cardRef);

      if (result === "permission-denied") {
        Alert.alert(
          "Photo access is off",
          "Allow North to add photos, then try saving again.",
        );
      } else {
        Alert.alert("Saved to Photos");
      }
    } catch {
      Alert.alert("Could not save", "Nothing was changed. Try again.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <OnboardingFrame
      actionLabel="Continue"
      haptic="none"
      layout="stacked"
      onContinue={onContinue}
      title="Here's where you stand."
    >
      <View collapsable={false} ref={cardRef} style={styles.card}>
        <View
          accessibilityLabel={`Where you stand across six axes. ${AXES.map(
            (axis) => `${LABELS[axis]}, ${realityBand(byAxis.get(axis) ?? 0)}`,
          ).join(". ")}`}
          accessibilityRole="image"
          style={styles.graph}
        >
          <Svg height="100%" viewBox={`0 0 ${SIZE} ${SIZE}`} width="100%">
            {[0.25, 0.5, 0.75, 1].map((scale) => (
              <Polygon
                fill="none"
                key={scale}
                points={AXES.map((_, index) => point(index, scale))
                  .map(formatPoint)
                  .join(" ")}
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

            <RealityPolygon progress={progress} readings={ordered} />

            {ordered.map((off, index) => (
              <RealityPoint
                axis={AXES[index]}
                index={index}
                key={AXES[index]}
                off={off}
                progress={progress}
              />
            ))}

            {AXES.map((axis, index) => {
              const label = labelPoint(index);
              return (
                <SvgText
                  fill={AXIS_COLORS[axis]}
                  fontFamily={typography.monoMedium}
                  fontSize={axis === "appetite" ? 8.5 : 9.5}
                  key={axis}
                  letterSpacing="0.45"
                  textAnchor={label.anchor}
                  x={label.x}
                  y={label.y}
                >
                  {LABELS[axis]}
                </SvgText>
              );
            })}
          </Svg>
        </View>
      </View>

      <View style={styles.utilities}>
        <Pressable
          accessibilityLabel={saving ? "Saving image" : "Save image"}
          accessibilityRole="button"
          disabled={saving}
          hitSlop={8}
          onPress={() => void save()}
          style={({ pressed }) => [
            styles.saveButton,
            (pressed || saving) && styles.saveButtonMuted,
          ]}
        >
          <DownloadIcon />
        </Pressable>
      </View>
    </OnboardingFrame>
  );
}

function DownloadIcon() {
  return (
    <Svg focusable={false} height={22} viewBox="0 0 24 24" width={22}>
      <Line
        stroke={colors.paper}
        strokeLinecap="round"
        strokeWidth="1.8"
        x1="12"
        x2="12"
        y1="3"
        y2="15"
      />
      <Polygon
        fill={colors.paper}
        points="6.8,11 12,16.2 17.2,11 15.9,9.7 12,13.6 8.1,9.7"
      />
      <Line
        stroke={colors.paper}
        strokeLinecap="round"
        strokeWidth="1.8"
        x1="4"
        x2="20"
        y1="20"
        y2="20"
      />
    </Svg>
  );
}

function RealityPolygon({
  progress,
  readings,
}: {
  progress: SharedValue<number>;
  readings: number[];
}) {
  const animatedProps = useAnimatedProps(() => ({
    points: readings
      .map((off, index) => {
        const scale = axisProgress(progress.get(), index) * (off / 100);
        return formatPoint(point(index, scale));
      })
      .join(" "),
  }));

  return (
    <AnimatedPolygon
      animatedProps={animatedProps}
      fill={colors.meridian}
      fillOpacity="0.08"
      stroke={colors.meridian}
      strokeLinejoin="round"
      strokeWidth="1.8"
    />
  );
}

function RealityPoint({
  axis,
  index,
  off,
  progress,
}: {
  axis: Axis;
  index: number;
  off: number;
  progress: SharedValue<number>;
}) {
  const animatedProps = useAnimatedProps(() => {
    const value = point(
      index,
      axisProgress(progress.get(), index) * (off / 100),
    );
    return { cx: value.x, cy: value.y };
  });

  return (
    <AnimatedCircle
      animatedProps={animatedProps}
      fill={AXIS_COLORS[axis]}
      r="4.5"
      stroke={colors.fieldDeep}
      strokeWidth="1.5"
    />
  );
}

function axisProgress(progress: number, index: number) {
  "worklet";
  const start = index * 0.1;
  return interpolate(
    progress,
    [start, start + 0.5],
    [0, 1],
    Extrapolation.CLAMP,
  );
}

function point(index: number, scale: number): Point {
  "worklet";
  const angle = -Math.PI / 2 + index * (Math.PI / 3);
  const bounded = Math.min(1, Math.max(0, scale));
  return {
    x: CENTRE + Math.cos(angle) * RADIUS * bounded,
    y: CENTRE + Math.sin(angle) * RADIUS * bounded,
  };
}

function formatPoint(value: Point) {
  "worklet";
  return `${value.x},${value.y}`;
}

function labelPoint(
  index: number,
): Point & { anchor: "end" | "middle" | "start" } {
  const angle = -Math.PI / 2 + index * (Math.PI / 3);
  const cosine = Math.cos(angle);
  return {
    anchor: cosine > 0.3 ? "start" : cosine < -0.3 ? "end" : "middle",
    x: CENTRE + cosine * LABEL_RADIUS,
    y: CENTRE + Math.sin(angle) * LABEL_RADIUS + 3,
  };
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.field,
    borderColor: colors.line,
    borderCurve: "continuous",
    borderRadius: radii.card,
    borderWidth: 1,
    overflow: "hidden",
    padding: spacing.lg,
  },
  graph: {
    alignSelf: "center",
    aspectRatio: 1,
    maxWidth: 340,
    width: "100%",
  },
  saveButton: {
    alignItems: "center",
    backgroundColor: colors.fieldRaised,
    borderColor: colors.line,
    borderCurve: "continuous",
    borderRadius: radii.control,
    borderWidth: 1,
    height: 44,
    justifyContent: "center",
    width: 44,
  },
  saveButtonMuted: {
    opacity: 0.55,
  },
  utilities: {
    alignItems: "flex-end",
    paddingTop: spacing.sm,
    width: "100%",
  },
});
