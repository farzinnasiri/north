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

export type BearingRule = (readings: AxisReading[]) => number;

/**
 * Temporary equal-weight rule for the frontend prototype.
 *
 * The product has not settled how the six Axes collapse into a Bearing, and
 * equal weight is a placeholder rather than a position — the research argues
 * Agency is load-bearing and may deserve more. Keep that values decision behind
 * this function so replacing it does not touch onboarding or the scoring.
 */
export const placeholderBearingRule: BearingRule = (readings) => {
  if (readings.length === 0) {
    return 0;
  }

  const meanOff = readings.reduce((total, reading) => total + reading.off, 0) / readings.length;
  return Math.round(Math.min(180, Math.max(0, meanOff * 1.8)));
};

