import type { Axis } from '@/domains/bearing/initial-bearing';

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
    body: 'Not a speech, and not to the room. One sentence, to the person it is actually about.',
    id: 'frame-say-it',
    lesson:
      'Every sentence you swallow is a small payment for being easy to be around. The interest on it is that people end up knowing a version of you that you built for their convenience.',
    title: 'Say the thing you would normally swallow.',
  },
  {
    axis: 'frame',
    body: 'Not the version you soften until it agrees with them. The one you actually hold.',
    id: 'frame-disagree',
    lesson:
      'Being liked and being respected are bought with different currencies, and you cannot spend the same hour on both. Disagreement is the cheapest test of which one you have been buying.',
    title: 'Disagree out loud, once, without sanding the edges off it.',
  },
  {
    axis: 'desire',
    body: 'Someone you would normally decide is out of reach before anything is said.',
    id: 'desire-speak-first',
    lesson:
      'The rejection you fear has already happened — you did it yourself, on their behalf, before they had a say. Speaking first is not confidence. It is refusing to answer for them.',
    title: 'Start the conversation you would normally talk yourself out of.',
  },
  {
    axis: 'desire',
    body: 'Plainly, to someone who is free to say no. The no has to be genuinely available.',
    id: 'desire-name-want',
    lesson:
      'A want you never state stays a fantasy, and fantasies cost nothing and return nothing. Stating it is the moment it becomes something the world can answer.',
    title: 'Say what you want to the person who can actually give it.',
  },
  {
    axis: 'connection',
    body: 'The one you keep meaning to message. Not a group, not a like. Them.',
    id: 'connection-reach',
    lesson:
      'Friendships do not end in arguments. They end in deferrals, one reasonable week at a time, and the person who moves first is almost never the one who was missed less.',
    title: 'Reach for someone you have let drift.',
  },
  {
    axis: 'connection',
    body: 'Something true about how you actually are, to someone who will hear it properly.',
    id: 'connection-true-answer',
    lesson:
      'Fine is a door you hold shut from the inside. Nobody can be close to a man who answers every question about himself with maintenance work.',
    title: 'Give someone the real answer.',
  },
  {
    axis: 'appetite',
    body: 'The hour that usually disappears. Take it back and spend it on purpose.',
    id: 'appetite-take-the-hour',
    lesson:
      'You are not short of time. You are short of hours you chose. The difference between the two is the whole distance between the life you have and the one you describe.',
    title: 'Reclaim one hour that normally vanishes.',
  },
  {
    axis: 'appetite',
    body: 'Whatever you reach for when the day goes badly. Put it down for the length of this.',
    id: 'appetite-put-it-down',
    lesson:
      'The thing you reach for is not the problem. Reaching without deciding is. You find out which one you are doing the moment it is not available.',
    title: 'Go without the thing you reach for.',
  },
  {
    axis: 'craft',
    body: 'Something nobody is waiting for and nobody will chase you about.',
    id: 'craft-finish',
    lesson:
      'Anyone can finish work that has a boss attached. What you finish unwatched is the only honest measure of whether your word to yourself means anything.',
    title: 'Finish something nobody is waiting for.',
  },
  {
    axis: 'craft',
    body: 'The physical work you have been putting off. Not a programme. The session you skipped.',
    id: 'craft-body',
    lesson:
      'Your body keeps a plainer record than your memory does. It is not about looking like anything; it is that the record is public to you every morning.',
    title: 'Do the physical work you keep postponing.',
  },
  {
    axis: 'agency',
    body: 'Not because it was expected, not because someone asked. Because you decided.',
    id: 'agency-choose',
    lesson:
      'Most days are assembled out of other people’s expectations, and they run fine that way. One decision that is provably yours is how you find out the steering still works.',
    title: 'Do one thing today purely because you chose it.',
  },
  {
    axis: 'agency',
    body: 'Small enough to survive, real enough that it could actually go badly.',
    id: 'agency-risk',
    lesson:
      'Confidence is not issued at birth and it is not talked into place. It is the residue of surviving things that could have gone the other way, which is why it cannot be borrowed.',
    title: 'Take a risk that can genuinely go wrong.',
  },
];

export function authoredAction(id: string): AuthoredAction | undefined {
  return CATALOGUE.find((action) => action.id === id);
}
