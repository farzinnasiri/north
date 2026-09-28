import type { Axis } from '@/domains/direction/initial-direction';

/**
 * The authored corpus. Actions are deliberately abstract: the system proposes a
 * direction, and deciding what it means today is itself the muscle being
 * trained. Nothing here may be literal enough to act on harmfully, and nothing
 * here is generated — same inputs, same Action, every time.
 *
 * This is scaffolding for the loop, not the finished corpus. The real material
 * comes from the founder's notes, and replacing these entries is a content
 * task that touches no code.
 */
export type AuthoredAction = {
  axis: Axis;
  /** The clarifier under the direction. Removes the easy reading of it. */
  body: string;
  id: string;
  /** Why this one. Short, unsentimental, and never a pep talk. */
  lesson: string;
  title: string;
};

export const CATALOGUE: readonly AuthoredAction[] = [
  {
    axis: 'frame',
    body: 'One sentence, to the person who needs to hear it.',
    id: 'frame-say-it',
    lesson:
      'Avoiding the sentence keeps the peace for a moment. It also leaves the other person guessing.',
    title: 'Say what you have been holding back.',
  },
  {
    axis: 'frame',
    body: 'Say what you think without turning it into a fight.',
    id: 'frame-disagree',
    lesson:
      'Disagreeing clearly shows whether you can hold your position and stay in the conversation.',
    title: 'Disagree once without softening your answer.',
  },
  {
    axis: 'desire',
    body: 'Pick someone you want to know. Start the conversation.',
    id: 'desire-speak-first',
    lesson: 'You cannot know their answer before you ask.',
    title: 'Start the conversation.',
  },
  {
    axis: 'desire',
    body: 'Ask the person who can answer. Leave room for no.',
    id: 'desire-name-want',
    lesson: 'An unstated want cannot be answered.',
    title: 'Say what you want.',
  },
  {
    axis: 'connection',
    body: 'Message one person you keep meaning to contact.',
    id: 'connection-reach',
    lesson: 'Waiting makes the distance easier to ignore and harder to close.',
    title: 'Contact someone you miss.',
  },
  {
    axis: 'connection',
    body: 'Tell someone you trust how you are doing.',
    id: 'connection-true-answer',
    lesson:
      'A stock answer ends the conversation. A specific one gives them something to respond to.',
    title: 'Give an honest answer.',
  },
  {
    axis: 'appetite',
    body: 'Use one hour as you planned before another app takes it.',
    id: 'appetite-take-the-hour',
    lesson: 'The point is choosing where one hour goes, not perfect discipline.',
    title: 'Choose how you spend one hour.',
  },
  {
    axis: 'appetite',
    body: 'Skip the thing you reach for when the day goes badly.',
    id: 'appetite-put-it-down',
    lesson: 'A short break shows whether you chose it or reached for it without thinking.',
    title: 'Go without it once.',
  },
  {
    axis: 'craft',
    body: 'Finish something no one else is tracking.',
    id: 'craft-finish',
    lesson: 'This tests whether you follow through without pressure from someone else.',
    title: 'Finish something for yourself.',
  },
  {
    axis: 'craft',
    body: 'Do the session you have been putting off.',
    id: 'craft-body',
    lesson: 'One completed session matters more than another plan.',
    title: 'Do the physical work.',
  },
  {
    axis: 'agency',
    body: 'Do one thing because you decided to do it.',
    id: 'agency-choose',
    lesson: 'The choice should be yours, not a request or obligation.',
    title: 'Make one choice of your own.',
  },
  {
    axis: 'agency',
    body: 'Choose something small where failure is possible.',
    id: 'agency-risk',
    lesson: 'Confidence comes after you act, not before.',
    title: 'Take one small risk.',
  },
];

export function authoredAction(id: string): AuthoredAction | undefined {
  return CATALOGUE.find((action) => action.id === id);
}
