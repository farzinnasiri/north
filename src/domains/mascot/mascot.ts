/**
 * The mascot is North's face, not the product itself. Callers describe a
 * complete destination scene; the mascot owns how it gets there.
 */
export type MascotExpression =
  | 'neutral'
  | 'focused'
  | 'loading'
  | 'proud'
  | 'sad'
  | 'concerned'
  | 'tired'
  | 'direction'
  | 'compass'
  | 'settled';

export type MascotDuration =
  | 'arrival'
  | 'instant'
  | 'quick'
  | 'settle';

export type MascotTiming = MascotDuration | number;

export type MascotRotation = {
  /**
   * Absolute, continuous degrees. Values are not normalized: 360 deliberately
   * makes one clockwise turn, while -90 turns a quarter-turn the other way.
   */
  angle: number;
  duration?: MascotTiming;
};

export type MascotRotations = {
  cardinals?: MascotRotation;
  face?: MascotRotation;
  outer?: MascotRotation;
};

export type MascotExpressionTransition =
  | 'default'
  | 'morph'
  | 'acknowledge'
  | 'immediate';

export type MascotGesture = {
  /** Restrained, one-shot body movement. The mascot never loops or bounces. */
  kind: 'acknowledge' | 'arrive' | 'orient-left' | 'orient-right';
  /** Change this value to deliberately replay the same gesture. */
  cue: number | string;
  duration?: MascotTiming;
};

export type MascotScene = {
  /** Bearing used when the eyes become the compass needle. */
  bearing?: number;
  /** 0-1. Inscribes completed graduations around the outer bezel. */
  completion?: number;
  expression: MascotExpression;
  gesture?: MascotGesture;
  rotations?: MascotRotations;
  transition?: {
    duration?: MascotTiming;
    expression?: MascotExpressionTransition;
  };
};
