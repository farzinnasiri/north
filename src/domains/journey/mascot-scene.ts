import type { MascotScene } from '@/domains/mascot/mascot';
import type { ActionState, NorthState } from '@/domains/journey/journey';

type HomeSceneInput = {
  direction: number;
  /** Set only when he has just closed an Action and the needle is about to move. */
  acknowledge: number | null;
  action: ActionState;
  north: NorthState;
  startingDirection: number;
};

/**
 * The Mascot registers the state of the home screen and nothing else. An
 * overdue Deadline is met with concern, never disappointment: the product's
 * promise is that inactivity is not punished, and a face that sulks would
 * break it more effectively than any copy could.
 *
 * Nothing moves on arrival. The one gesture here belongs to a closeout he just
 * performed, which is a change he caused.
 */
export function homeMascotScene({
  acknowledge,
  action,
  direction,
  north,
  startingDirection,
}: HomeSceneInput): MascotScene {
  const travelled = startingDirection <= 0 ? 1 : (startingDirection - direction) / startingDirection;

  return {
    direction,
    completion: Math.min(1, Math.max(0, travelled)),
    expression: expressionFor(action, north),
    gesture: acknowledge === null ? undefined : { cue: acknowledge, kind: 'acknowledge' },
    transition: { duration: 'settle' },
  };
}

function expressionFor(action: ActionState, north: NorthState): MascotScene['expression'] {
  if (north.kind === 'exit') return 'proud';
  if (north.kind === 'holding' || north.kind === 'near') return 'direction';
  switch (action.kind) {
    case 'overdue':
      return 'concerned';
    case 'running':
      return 'focused';
    default:
      return 'compass';
  }
}
