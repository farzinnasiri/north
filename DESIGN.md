---
version: alpha
name: North
description: A restrained, pre-dawn interface that treats direction as serious, quiet work.
colors:
  primary: "#C9A227"
  primary-hover: "#D9B02E"
  primary-muted: "#8F7318"
  on-primary: "#2E2405"
  secondary: "#1F4E8C"
  secondary-light: "#5C8FD6"
  error: "#A32D2D"
  error-light: "#C4494A"
  error-text: "#D96B6B"
  surface: "#0F1319"
  surface-container: "#12161C"
  surface-container-high: "#1A1F27"
  outline: "#2A3038"
  outline-soft: "#20262E"
  on-surface: "#F2F0EB"
  on-surface-muted: "#9BA3AD"
  on-surface-subtle: "#7E8288"
typography:
  display:
    fontFamily: Inter
    fontSize: 34px
    fontWeight: 500
    lineHeight: 1.2
    letterSpacing: -0.02em
  daily-line:
    fontFamily: Inter
    fontSize: 25px
    fontWeight: 500
    lineHeight: 1.32
    letterSpacing: -0.02em
  heading:
    fontFamily: Inter
    fontSize: 20px
    fontWeight: 500
    lineHeight: 1.3
    letterSpacing: -0.01em
  body:
    fontFamily: Inter
    fontSize: 15px
    fontWeight: 400
    lineHeight: 1.62
  body-small:
    fontFamily: Inter
    fontSize: 13px
    fontWeight: 400
    lineHeight: 1.55
  data:
    fontFamily: JetBrains Mono
    fontSize: 19px
    fontWeight: 500
    lineHeight: 1.2
  label:
    fontFamily: JetBrains Mono
    fontSize: 11px
    fontWeight: 400
    lineHeight: 1.2
    letterSpacing: 0.1em
rounded:
  control: 8px
  card: 12px
  device: 26px
  full: 9999px
spacing:
  xs: 4px
  sm: 8px
  md: 12px
  lg: 16px
  xl: 24px
  2xl: 32px
  3xl: 48px
  screen-horizontal: 22px
motion:
  instant: 90ms
  quick: 150ms
  settle: 240ms
  arrival: 520ms
  commit-hold: 10000ms
  thinking-min: 5000ms
  thinking-max: 10000ms
  easing-standard: cubic-bezier(0.32, 0.72, 0, 1)
  easing-exit: cubic-bezier(0.4, 0, 1, 1)
  needle-damping: 18
  needle-stiffness: 90
  needle-mass: 1.1
  press-scale: 0.97
  press-opacity: 0.9
sound:
  close-out: 180ms
  bearing-move: 400ms
  contract-signed: 500ms
  reach-north: 600ms
components:
  screen:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.on-surface}"
  surface:
    backgroundColor: "{colors.surface-container}"
    textColor: "{colors.on-surface-muted}"
    rounded: "{rounded.card}"
    padding: 16px
  surface-raised:
    backgroundColor: "{colors.surface-container-high}"
    textColor: "{colors.on-surface}"
    rounded: "{rounded.card}"
    padding: 16px
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.on-primary}"
    typography: "{typography.body}"
    rounded: "{rounded.control}"
    padding: 14px
  button-primary-hover:
    backgroundColor: "{colors.primary-hover}"
    textColor: "{colors.on-primary}"
    rounded: "{rounded.control}"
  button-quiet:
    backgroundColor: transparent
    textColor: "{colors.on-surface-muted}"
    typography: "{typography.body}"
    rounded: "{rounded.control}"
    padding: 14px
  metric-live:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.primary}"
    typography: "{typography.data}"
  metric-earned:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.secondary-light}"
    typography: "{typography.data}"
  metric-overdue:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.error-text}"
    typography: "{typography.data}"
  compass:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.primary}"
    size: 176px
  meridian-fill:
    backgroundColor: "{colors.secondary}"
  warning:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.on-surface}"
  warning-edge:
    backgroundColor: "{colors.error-light}"
  ember-fill:
    backgroundColor: "{colors.error}"
  divider:
    backgroundColor: "{colors.outline}"
    height: 1px
  divider-soft:
    backgroundColor: "{colors.outline-soft}"
    height: 1px
  metadata-mark:
    backgroundColor: "{colors.on-surface-subtle}"
  accent-muted:
    backgroundColor: "{colors.primary-muted}"
---

## Overview

North should feel like the sky before dawn: dark, still, and directional. It is
serious without being aggressive, masculine without prescribing one masculine
archetype, and warm without pretending to be a friend. Restraint is the visual
differentiator in a category crowded with red-and-black hype.

Every screen answers one question and asks for one thing. The interface absorbs
complexity rather than turning it into dashboards, feeds, scores, or settings.
Success is the point at which the product can quietly be left behind.

## Colors

- **Field (`surface`, `surface-container`):** Near-black with a blue cast. It
  should read as pre-dawn sky, not gym black.
- **Brass (`primary`):** The live action and the single thing that matters now.
  There may be only one brass element in view.
- **Meridian (`secondary`):** A steady or already-earned state. Use the light
  variant for text on dark surfaces.
- **Ember (`error`):** A hard truth or consequential state. Hold it in reserve;
  routine use destroys its weight. Ember has three tokens and they are not
  interchangeable. `error` is the fill. `error-light` is an edge or non-text
  mark only — it sits at 3.9:1 on field and fails AA for prose. `error-text` is
  the only ember permitted on type; it clears AA at 5.6:1 and is deliberately
  close to meridian-light's 5.6:1, so an overdue metric and an earned metric
  carry the same visual weight rather than one shouting over the other.
- **Paper (`on-surface`):** Warm `#F2F0EB`, never pure white. It keeps the UI
  from becoming clinical.
- **Ash and slate:** Supporting copy, metadata, and labels. They create hierarchy
  without adding decoration. The three text tones are a deliberate ladder on
  field — paper 16.4:1, ash 7.3:1, slate 4.8:1 — and every rung clears AA.
  Slate is the floor. Nothing dimmer than slate may carry words.

Maintain WCAG AA contrast for body text. Never use color as the only carrier of
meaning.

## Typography

Inter is the human voice. JetBrains Mono is the factual voice. Use Inter for
directions, explanations, and coach copy; use JetBrains Mono for bearing,
deadlines, counts, and compact labels.

Only weights 400 and 500 are permitted. Bold or black weights read as shouting.
Daily lines use sentence case and end in a full stop. Uppercase is reserved for
short mono labels, never prose or calls to action.

## Layout

North is mobile-first and vertically composed. Use safe areas, a quiet single
column, and enough negative space for the live action to remain unmistakable.
Primary content uses roughly 22–24px horizontal insets. Keep related explanatory
content together, but do not turn the home surface into a card grid.

One screen should expose one primary decision. Secondary actions may follow the
primary action, but must not compete with it. Layout is allowed to evolve from
the HTML prototypes; the one-purpose rule is not.

During onboarding, every question prompt starts in the same fixed lane below
the Mascot; its vertical position must not depend on the prompt length or the
instrument beneath it. That lane sits lower than the Mascot's immediate edge so
the prompt stays in the forward sightline. The instrument owns the remaining
lower space and primary continuation actions remain at the bottom safe area.

## Elevation & Depth

Depth comes from tonal layers and half-strength borders, not shadows. The field
deep color is the canvas, field is a contained surface, and field raised is an
interactive or selected layer. Avoid floating glass, glow, gradients, and heavy
drop shadows.

## Shapes

Use 8px radii for controls and contained action details, 12px for larger cards,
and pill shapes only where the object is genuinely circular or capsule-shaped.
The compact radii keep the interface considered without making it playful.

## Mascot

The Mascot is a face built as a compass instrument: an outer tick bezel, a
cardinal ring, and a square-eyed face rotor. Those three layers rotate
independently. Product code calls it `Mascot`; “North mascot” and “face” are
acceptable descriptive phrases, but `North` alone remains the product name.

The Mascot registers what is happening. On the first onboarding screen only,
product copy beside it may speak in the first person to introduce North. It
does not use a speech bubble or mouth, and after that introduction it does not
speak, judge an answer, nag, celebrate, or become a coach. Its eyes carry
expression without a mouth.
The accepted expressions are neutral, focused, loading, proud, sad, concerned,
tired, direction, compass, and settled. Proud means quiet recognition — “I am
proud of you” — rather than generic happiness.

A mascot scene is a complete destination state: expression, bearing, completed
graduations, three absolute layer rotations, expression transition, and at
most one restrained body gesture. Screens choose scenes; the Mascot owns SVG
geometry, interpolation, interruption, and reduced motion. Size and layout
placement stay with the surface rendering it.

Expression changes morph the same eye paths. Proud uses one acknowledgment
blink by default. Body movement is limited to a one-shot arrival during the
first onboarding screen, acknowledgment dip, or small left/right orientation
shift, using the standard duration tokens and decelerating curve. The Mascot
never bounces, shakes, pulses, floats, breathes, or runs an idle loop. Outside
that authored onboarding arrival, nothing moves when it first mounts.

## Motion

North moves like an instrument, not an interface. Everything decelerates into
place; nothing accelerates, bounces, or arrives early. `easing-standard` is the
default curve. `instant`, `quick`, and `settle` cover ordinary interaction;
`arrival` is reserved for the Mascot's one onboarding entrance. `thinking-min`
and `thinking-max` bound the sampled, one-shot alter-ego and initial-bearing
pauses. Reach for `quick` unless one of those authored moments is being
implemented.

- **The needle is the only spring.** One physical object, the way there is one
  brass element. Its damping, stiffness, and mass are tokens because they are
  design decisions, not implementation detail. Everything else in the product
  uses a decelerating curve.
- **The needle never overshoots north.** The tokens are tuned to settle in
  roughly 700ms without crossing the bearing it is moving to. A compass that
  wobbles past its reading is a toy, and the whole product rests on this object
  being believable.
- **The needle moves once per closed action, and the person watches it.** The
  rest of the screen holds still while it does. This is North's only
  celebration, and it lasts less than a second.
- **Nothing animates on cold start.** The home screen is already there when the
  person looks at it. Entering animations belong to changes they caused, not to
  arrival.
- **Motion never repeats.** No pulse, no breathing, no shimmer, no skeleton
  wave, no looping hint. If it can play a second time without being asked, it is
  decoration and it does not ship.
- **The initial bearing is revealed, not fetched.** The deterministic result is
  held for one sampled thinking interval while the three Mascot rotors make finite opposing
  turns, then the number settles into its final value. This is a one-shot
  authored reveal, never a reusable fake-loading pattern.
- **Alter-ego curation gets one authored pause.** After every answer is in, the
  Mascot's outer rotors make finite opposing turns for one sampled thinking interval while
  the interface names the evidence being considered. The pause communicates
  that the following suggestion belongs to this person; it does not imply a
  network request and is not reused elsewhere.
- **The contract is held, not signed, and the whole screen answers.** Giving
  his word is one press held for `commit-hold` — ten seconds, deliberately
  longer than any other interaction in the product, because this is the promise
  that replaces notifications. While his hand is down: a brass hairline draws
  itself clockwise around the edge of the screen, the fill sweeps across the
  button under his thumb, the Mascot winds a quarter turn per clause, and the
  clauses of the contract light one at a time as the line passes them. Letting
  go retracts all of it over `quick`. It is the one authored ceremony in North,
  it is the only place a person's own pressure drives the interface, and it
  happens once in a lifetime of using the app.
- **Content arrives through `Reveal`, and only when the person caused it.** A
  short rise and fade over `quick`. Layout animations are not used: they do not
  run on the web preview surface, so the same fade would need a second
  implementation per screen to stay visible while developing.
- **Press feedback is `press-scale` and `press-opacity` over `instant` in and
  `quick` out.** A flat opacity dip is the least considered feedback available.
  The scale is deliberately at the strong end of the subtle band: below about
  0.97 a press stops being felt on a full-width control, and an unfelt press
  reads as an interface that did not hear you. It is a transition, never a
  style swap — a scale that arrives in one frame is a jump, not feedback.

Never use celebratory motion, confetti, shaking, or pulsing pressure.

Under the system reduced-motion setting, all nonessential animation is removed.
The needle is the exception and must not simply be disabled: it cross-fades
between its old and new bearing over `settle` instead of sweeping. The bearing
change stays perceptible; only the sweep goes.

## Sound and haptics

Sound is rare enough to mean something. North has four sounds, and that number
is a budget rather than a starting point. All four are dry, single events with
no reverb, no rising interval, and no layering.

| Cue | Character | Budget |
| --- | --- | --- |
| Close out | One low wooden knock. The sound of a thing set down, not a prize. | `close-out` |
| Bearing move | One brass tine, plucked and decaying, under the needle. | `bearing-move` |
| Contract signed | The knock and the tine together, once, in onboarding only. | `contract-signed` |
| Reach north | The tine an octave up, alone. Plays once in a person's lifetime. | `reach-north` |

Nothing else makes a sound. Not navigation, not tab changes, not button
presses, not saving a note, not choosing a deadline. **A missed deadline is
silent** — an interface that buzzes at a person for stalling has already broken
the promise that inactivity is not punished.

Sound respects the device silent switch, never plays when the system
reduced-motion setting is on, and is never the only carrier of meaning. Haptics
follow the same logic: light impact on a primary press, selection ticks in the
deadline picker, one selection tick for each graduation the contract hold
closes, one success notification on closeout, medium impact when the contract
is committed. There is no haptic for a miss, an overdue state, or an error.

## Components

- **Primary action:** Full width on mobile, brass fill, dark brass-on text, 8px
  radius. It is normally the only brass element on the screen.
- **Quiet action:** Transparent with a thin outline and muted text. It follows,
  rather than sits beside, the primary action on narrow screens.
- **Metrics:** Mono only. Live direction may use brass; completed or held facts
  use meridian. Present numbers plainly, without rings, badges, or score effects.
- **State lesson:** A short text block with a restrained two-pixel semantic edge.
  It explains the moment; it does not become an alert banner.
- **Action detail:** A field surface with one compact mono label and human prose.
  Do not style it as evidence, verification, or a social artifact.
- **Compass:** A sparse instrument, not a gamified progress ring, and the one
  object in North that is drawn rather than laid out. At the `compass` size
  token it is two concentric hairline rings inset roughly 10px from each other,
  an `N` in mono label type at the top of the outer ring, a brass north needle
  running from the hub to just inside the inner ring, a dimmed south needle at
  about a fifth of that length, and a small brass hub. North is always screen-up
  and the needle carries the bearing; the dial never rotates under a fixed
  needle. It must stay readable with motion removed and must state its bearing
  through its accessibility label, because a person using a screen reader cannot
  watch it move.

### Component inventory

Everything below is built. Compose from it before adding anything new, and put
a new primitive in `src/components/ui/` only when it is genuinely
product-agnostic — anything that knows what a Bearing or an Action is belongs
to its domain's `ui/` folder instead.

| Primitive | Use it for |
| --- | --- |
| `NorthScreen` | Every scrolling screen body. Owns insets, gutters, and rhythm. |
| `NorthText` | All type. `display`, `title`, `heading`, `body`, `small`, `label`, `data`. |
| `NorthButton` | Primary, secondary, and quiet actions, with the press transition. |
| `NorthField` | Anything a person types. |
| `NorthRow` | One line of a list: label, detail, and a value or a control. |
| `Section` | A labelled group in the single column, optionally ruled. |
| `Surface` | A contained fact, such as the Named Action. |
| `Metric` | A mono fact with a label. Tones: default, earned, overdue. |
| `Reveal` | The one way content arrives. See Motion. |
| `Compass` | The instrument, where the instrument is the subject. |
| `NorthMark` | The product mark. Boot only. |
| `HoldButton` | A press that has to be held. Used once, for the Contract. |
| `TracingFrame` | The circuit drawn around the screen edge. Contract only. |
| `InstrumentSlider`, `NumberTape`, `DayBar`, `TallyInstrument`, `RankInstrument`, `ChoiceInstrument`, `TimeSinceArc` | Onboarding instruments. Reusable anywhere a graduated value is set. |
| `ProgressRail`, `CompassProgress` | Position in a long flow. |

Domain UI that is not a primitive: `Mascot` (mascot), `ActionBrief` (actions),
`BearingScale` (bearing), `NorthStarPortrait` (onboarding).

## Platform surface

North uses native chrome and bespoke content, and the line between them is not
a matter of taste.

Anything the operating system owns — the tab bar, the navigation stack, sheets
and their detents, the keyboard, scroll physics, text selection, context menus,
share, and the system back gesture — uses the real native component, adjusted
only for color. These are the parts a person already knows how to use, and
reimplementing them in JavaScript makes the product feel cheaper, not more
designed.

Anything North owns — the compass, the daily line, metrics, the action detail,
the primary action, the contract and its signature — is drawn from these tokens
and never inherits system appearance. Do not adopt platform semantic colors;
North is a fixed dark palette and system colors would fight it.

North also declines the current platform vernacular where it contradicts the
product. Translucent or glass navigation surfaces are switched off rather than
inherited, because depth here comes from tonal layers and hairlines. The
interface should look like it was made for this product in this decade, not
like it was assembled from whatever the OS was shipping that year.

## Accessibility

Accessibility is part of the contract, not a pass at the end.

- Every text tone clears WCAG AA on field. Slate is the dimmest tone allowed to
  carry words; anything below it is a rule, a fill, or a mark.
- Interactive targets are at least 44pt on their shortest side.
- Numbers that change in place use tabular figures so digits do not jitter.
- Text the person wrote or may want to keep — the daily line, their named
  action, a note — is selectable.
- Type honors the system text size up to a capped multiplier. Fixed type is not
  acceptable in a product whose own principle is that the design is a reason to
  open it.
- The bearing announces itself as a plain fact when it changes, because the
  needle's movement is the only place that information exists otherwise.
- Under reduced motion, the app removes animation but never removes
  information. See Motion for the needle's cross-fade.

## Do's and Don'ts

- Do make the live action visually inevitable.
- Do challenge behavior with direct, warm, unsentimental copy.
- Do state missed deadlines factually and leave the door open.
- Do keep the designed exit visible as the bearing approaches north.
- Do use one brass element in view; do not scatter accent color.
- Do let the needle be the only thing moving when it moves.
- Do keep a missed deadline silent, still, and unbuzzed.
- Do not create dashboards, feeds, badges, levels, trophies, or leaderboards.
- Do not add a fifth sound, a looping animation, or a success chime.
- Do not use caps, exclamation marks, hustle language, or motivational shouting.
- Do not make the mascot speak, nag, celebrate, or become a coach.
- Do not add reminders or notifications. The signed contract owns that promise.
- Do not use visual pressure to manufacture retention after the user reaches the
  exit.
