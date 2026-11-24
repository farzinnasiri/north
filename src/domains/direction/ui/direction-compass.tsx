import { useEffect, useMemo, useRef } from 'react';
import { View } from 'react-native';
import Animated, {
  useAnimatedProps,
  useReducedMotion,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import Svg, { Circle, G, Line, Path, Text as SvgText } from 'react-native-svg';

import { useSignalTheme } from '@/components/ui/signal-theme';
import { colors, motion, typography } from '@/theme';

const AnimatedG = Animated.createAnimatedComponent(G);

const VIEW = 260;
const CENTRE = VIEW / 2;
const RING = 100;
const GRID = 20;
const TRAIL_SEGMENTS = 28;

type DirectionCompassProps = {
  /** Degrees off north, 0 to 180. The needle points here. */
  direction: number;
  /** Where the Journey began. The lit trail runs from here to the needle. */
  startingDirection?: number;
  size: number;
  /** Called when a needle movement starts and when it settles. */
  onMoveStart?: () => void;
  onMoveEnd?: () => void;
  /** Fill the square with the crosshair field. Off when the parent draws one. */
  field?: boolean;
};

/**
 * North's one instrument. A thin ring on a crosshair field, a needle that
 * points where he is, and a trail that lights the ground he has covered since
 * the day he started. The needle is the only spring in the app.
 */
export function DirectionCompass({
  direction,
  field = true,
  onMoveEnd,
  onMoveStart,
  size,
  startingDirection,
}: DirectionCompassProps) {
  const reduceMotion = useReducedMotion();
  const signal = useSignalTheme();
  const target = clamp(direction);
  const start = clamp(startingDirection ?? direction);
  const needle = useSharedValue(target);
  const first = useRef(true);

  useEffect(() => {
    if (first.current) {
      first.current = false;
      needle.value = target;
      return;
    }
    onMoveStart?.();
    const done = () => onMoveEnd?.();
    if (reduceMotion) {
      needle.value = withTiming(target, { duration: 0 });
      const timer = setTimeout(done, motion.settle);
      return () => clearTimeout(timer);
    }
    needle.value = withSpring(target, {
      damping: motion.needleDamping,
      mass: motion.needleMass,
      overshootClamping: false,
      stiffness: motion.needleStiffness,
    });
    const timer = setTimeout(done, motion.arrival * 2);
    return () => clearTimeout(timer);
    // The callbacks are notifications, not inputs: a new function identity must
    // not restart the needle.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [target, reduceMotion]);

  const needleProps = useAnimatedProps(() => ({
    transform: `rotate(${needle.value} ${CENTRE} ${CENTRE})`,
  }));

  const grid = useMemo(() => crosshairs(), []);
  const trail = useMemo(() => trailSegments(start, target), [start, target]);

  return (
    <View
      accessible
      accessibilityLabel={`${format(target)} degrees off north. North is zero.`}
      accessibilityRole="image"
      style={{ height: size, width: size }}
    >
      <Svg height={size} viewBox={`0 0 ${VIEW} ${VIEW}`} width={size}>
        {field ? (
          <G>
            {grid.map(({ x, y, lit }) => (
              <G key={`${x}-${y}`} opacity={lit ? 0.55 : 0.32} stroke={lit ? signal.light : colors.line} strokeWidth="1">
                <Line x1={x - 3} x2={x + 3} y1={y} y2={y} />
                <Line x1={x} x2={x} y1={y - 3} y2={y + 3} />
              </G>
            ))}
          </G>
        ) : null}

        <Circle cx={CENTRE} cy={CENTRE} fill="none" r={RING} stroke={colors.line} strokeWidth="1" />

        {Array.from({ length: 72 }, (_, index) => {
          const cardinal = index % 18 === 0;
          if (cardinal) return null;
          const major = index % 6 === 0;
          return (
            <Line
              key={index}
              stroke={colors.slate}
              strokeOpacity={major ? 0.9 : 0.55}
              strokeWidth={1}
              transform={`rotate(${index * 5} ${CENTRE} ${CENTRE})`}
              x1={CENTRE}
              x2={CENTRE}
              y1={CENTRE - RING - (major ? 5 : 3)}
              y2={CENTRE - RING + (major ? 5 : 3)}
            />
          );
        })}
        {[0, 90, 180, 270].map((angle) => (
          <Line
            key={angle}
            stroke={colors.ash}
            strokeWidth={1.4}
            transform={`rotate(${angle} ${CENTRE} ${CENTRE})`}
            x1={CENTRE}
            x2={CENTRE}
            y1={CENTRE - RING - 10}
            y2={CENTRE - RING + 10}
          />
        ))}
        <SvgText
          fill={signal.primary}
          fontFamily={typography.mono}
          fontSize="13"
          textAnchor="middle"
          x={CENTRE}
          y={CENTRE - RING + 28}
        >
          N
        </SvgText>

        {trail.map((segment) => (
          <Path
            d={segment.d}
            fill="none"
            key={segment.d}
            stroke={signal.primary}
            strokeLinecap="round"
            strokeOpacity={segment.opacity}
            strokeWidth="2.5"
          />
        ))}
        {start > target ? (
          <G>
            <Circle {...point(target, RING)} fill={signal.primary} opacity={0.22} r="7" />
            <Circle {...point(target, RING)} fill={colors.paper} r="2.6" />
          </G>
        ) : null}

        <AnimatedG animatedProps={needleProps}>
          <Line
            stroke={colors.slate}
            strokeLinecap="round"
            strokeWidth="4"
            x1={CENTRE}
            x2={CENTRE}
            y1={CENTRE}
            y2={CENTRE + 36}
          />
          <Line
            stroke={signal.primary}
            strokeLinecap="round"
            strokeWidth="4"
            x1={CENTRE}
            x2={CENTRE}
            y1={CENTRE}
            y2={CENTRE - RING + 38}
          />
        </AnimatedG>
        <Circle cx={CENTRE} cy={CENTRE} fill={signal.primary} r="7" />
      </Svg>
    </View>
  );
}

function clamp(value: number): number {
  return Math.max(0, Math.min(180, value));
}

function format(value: number): string {
  return Number.isInteger(value) ? `${value}` : value.toFixed(1);
}

function point(angle: number, radius: number): { cx: number; cy: number } {
  const radians = ((angle - 90) * Math.PI) / 180;
  return { cx: CENTRE + radius * Math.cos(radians), cy: CENTRE + radius * Math.sin(radians) };
}

/** The covered ground, brightest at the needle and fading toward the start. */
function trailSegments(start: number, now: number): { d: string; opacity: number }[] {
  if (start - now < 0.5) return [];
  const step = (start - now) / TRAIL_SEGMENTS;
  return Array.from({ length: TRAIL_SEGMENTS }, (_, index) => {
    const from = now + step * index;
    const to = from + step;
    const a = point(from, RING);
    const b = point(to, RING);
    return {
      d: `M ${a.cx.toFixed(2)} ${a.cy.toFixed(2)} A ${RING} ${RING} 0 0 1 ${b.cx.toFixed(2)} ${b.cy.toFixed(2)}`,
      opacity: Math.max(0.06, 1 - index / TRAIL_SEGMENTS),
    };
  }).reverse();
}

/** Crosshairs on a 20-point grid. The ones inside the ring take the signal. */
function crosshairs(): { x: number; y: number; lit: boolean }[] {
  const marks: { x: number; y: number; lit: boolean }[] = [];
  for (let x = GRID / 2; x < VIEW; x += GRID) {
    for (let y = GRID / 2; y < VIEW; y += GRID) {
      const distance = Math.hypot(x - CENTRE, y - CENTRE);
      marks.push({ lit: distance < RING * 0.62, x, y });
    }
  }
  return marks;
}
