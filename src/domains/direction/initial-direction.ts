/**
 * Five Axes measure conduct — what a man did and how often. Agency measures
 * stance: whether he believes he is the one choosing. Two men can give
 * identical conduct answers, and the one who believes he chose them is a
 * different man from the one who believes it happened to him.
 */
export type Axis = 'frame' | 'desire' | 'connection' | 'appetite' | 'craft' | 'agency';

export type AxisReading = {
  axis: Axis;
  off: number;
};

export type DirectionWeights = Record<Axis, number>;

export type RealityBand =
  | 'pattern looks steady'
  | 'mixed evidence'
  | 'may need attention';

/** Broad language for provisional candidate readings; exact values stay internal. */
export function realityBand(off: number): RealityBand {
  if (off <= 33) return 'pattern looks steady';
  if (off <= 66) return 'mixed evidence';
  return 'may need attention';
}

/**
 * Direction is the weighted gap between current conduct and the chosen North
 * Star. All six Axes remain in the calculation; the North Star only decides
 * which gaps carry more weight. The 0–100 gap is mapped to the compass arc.
 */
export function initialDirection(
  readings: readonly AxisReading[],
  weights: DirectionWeights,
): number {
  if (readings.length === 0) return 0;

  const weighted = readings.reduce(
    (result, reading) => ({
      total: result.total + reading.off * weights[reading.axis],
      weight: result.weight + weights[reading.axis],
    }),
    { total: 0, weight: 0 },
  );
  if (weighted.weight <= 0) return 0;

  const weightedGap = weighted.total / weighted.weight;
  return Math.round(Math.min(180, Math.max(0, weightedGap * 1.8)));
}
