---
version: alpha
name: North
description: A black physical navigation instrument lit by one personal live signal.
colors:
  primary: "#F03B32"
  primary-hover: "#FF554D"
  primary-muted: "#7D2B27"
  on-primary: "#090B0C"
  secondary: "#D9DBDA"
  secondary-light: "#FF8B84"
  error: "#8D1F1B"
  error-light: "#C94C45"
  error-text: "#FF9A94"
  surface: "#000000"
  surface-container: "#111416"
  surface-container-high: "#1B1F21"
  outline: "#484D50"
  outline-soft: "#292E31"
  on-surface: "#F4F4F0"
  on-surface-muted: "#B7BAB9"
  on-surface-subtle: "#7F8485"
  signal-gold: "#D2A64A"
  signal-gold-light: "#F2D58B"
  signal-gold-muted: "#6F5524"
  signal-tide: "#2BB7A8"
  signal-tide-light: "#80E0D2"
  signal-tide-muted: "#155E59"
  signal-cobalt: "#5F7CFF"
  signal-cobalt-light: "#A9B6FF"
  signal-cobalt-muted: "#2C3D80"
  axis-agency: "#F03B32"
  axis-frame: "#D2A64A"
  axis-desire: "#D96FA7"
  axis-connection: "#2BB7A8"
  axis-appetite: "#8B72E8"
  axis-craft: "#5F7CFF"
  glass-fill: "#1B1F21B8"
  glass-edge: "#FFFFFF1F"
  glass-highlight: "#FFFFFF38"
typography:
  display:
    fontFamily: Barlow Condensed
    fontSize: 60px
    fontWeight: 700
    lineHeight: 0.92
    letterSpacing: -0.025em
  daily-line:
    fontFamily: Barlow Condensed
    fontSize: 46px
    fontWeight: 700
    lineHeight: 0.96
    letterSpacing: -0.02em
  heading:
    fontFamily: Barlow Condensed
    fontSize: 32px
    fontWeight: 600
    lineHeight: 1
    letterSpacing: -0.01em
  body:
    fontFamily: Inter
    fontSize: 17px
    fontWeight: 400
    lineHeight: 1.5
  body-small:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: 400
    lineHeight: 1.5
  data:
    fontFamily: JetBrains Mono
    fontSize: 24px
    fontWeight: 500
    lineHeight: 1.2
  label:
    fontFamily: JetBrains Mono
    fontSize: 11px
    fontWeight: 500
    lineHeight: 1.2
    letterSpacing: 0.055em
rounded:
  control: 10px
  card: 16px
  glass: 26px
  device: 32px
  full: 9999px
spacing:
  xs: 4px
  sm: 8px
  md: 12px
  lg: 16px
  xl: 24px
  2xl: 36px
  3xl: 56px
  screen-horizontal: 24px
motion:
  instant: 90ms
  quick: 150ms
  settle: 240ms
  arrival: 520ms
  boot-hold: 1200ms
  commit-hold: 10000ms
  easing-standard: cubic-bezier(0.32, 0.72, 0, 1)
  easing-exit: cubic-bezier(0.4, 0, 1, 1)
  needle-damping: 18
  needle-stiffness: 90
  needle-mass: 1.1
  press-scale: 0.97
  press-opacity: 0.9
sound:
  close-out: 180ms
  direction-move: 400ms
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
  glass-surface:
    backgroundColor: "{colors.glass-fill}"
    textColor: "{colors.on-surface}"
    rounded: "{rounded.glass}"
    padding: 18px
  glass-divider:
    backgroundColor: "{colors.glass-edge}"
    height: 1px
  glass-highlight:
    backgroundColor: "{colors.glass-highlight}"
    height: 1px
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
    backgroundColor: "{colors.surface-container}"
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
    size: 304px
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
  signal-gilt:
    backgroundColor: "{colors.signal-gold}"
    textColor: "{colors.signal-gold-light}"
    borderColor: "{colors.signal-gold-muted}"
  signal-tide:
    backgroundColor: "{colors.signal-tide}"
    textColor: "{colors.signal-tide-light}"
    borderColor: "{colors.signal-tide-muted}"
  signal-cobalt:
    backgroundColor: "{colors.signal-cobalt}"
    textColor: "{colors.signal-cobalt-light}"
    borderColor: "{colors.signal-cobalt-muted}"
  axis-agency-mark:
    backgroundColor: "{colors.axis-agency}"
  axis-frame-mark:
    backgroundColor: "{colors.axis-frame}"
  axis-desire-mark:
    backgroundColor: "{colors.axis-desire}"
  axis-connection-mark:
    backgroundColor: "{colors.axis-connection}"
  axis-appetite-mark:
    backgroundColor: "{colors.axis-appetite}"
  axis-craft-mark:
    backgroundColor: "{colors.axis-craft}"
---

## Overview

North should feel like a physical navigation instrument opened in the dark:
an obsidian field, white information, and one personal live signal. It is serious
without becoming military, masculine without prescribing one masculine
archetype, and intense without behaving like a game. The differentiator is a
credible object with weight and consequence, not a dashboard decorated with a
compass.

Every screen answers one question and asks for one thing. The interface absorbs
complexity rather than turning it into dashboards, feeds, scores, or settings.
Success is the point at which the product can quietly be left behind.

## Colors

- **Obsidian (`surface`, `surface-container`):** The page field is absolute
  black. Near-black structural plates separate controls and instruments without
  turning the background into a gradient.
- **Chalk (`on-surface`):** Warm white information. It carries the product
  voice without the glare of pure digital white.
- **Signal (`primary`):** Live direction: the north needle, selected answer,
  progress segment, or primary action. A screen may contain several connected
  parts of one signal path, but red never becomes general decoration.
- **Steel (`secondary`):** Inactive instrument hardware and already-earned
  facts. It remains neutral so direction is never confused with status.
- **Ember (`error`):** A hard truth or consequential state. Hold it in reserve;
  routine use destroys its weight. Ember has three tokens and they are not
  interchangeable. `error` is the fill. `error-light` is an edge or non-text
  mark only — it sits at 3.9:1 on field and fails AA for prose. `error-text` is
  the only ember permitted on type; it clears AA at 5.6:1 and is deliberately
  close to meridian-light's 5.6:1, so an overdue metric and an earned metric
  carry the same visual weight rather than one shouting over the other.
- **Ash and slate:** Supporting copy, metadata, and labels. They create hierarchy
  without adding decoration. Slate remains the floor for text; nothing dimmer
  may carry words.

After onboarding, a person chooses one **Signal identity**. Obsidian, chalk,
steel, and ember never change; only the live directional family changes. Signal
is Direct Red, warm gold is Quiet Gold, blue-green is Open Teal, and vivid blue
is Electric Blue. North suggests one deterministically from the chosen North
Star, but the suggestion is never a personality diagnosis and can be changed in
Settings. This is controlled semantic color, not an app-wide theme picker.

The pre-auth introduction may place one solid muted-Signal shape behind its
content. The shape is atmosphere, not state; no instruction may depend on it.

Reality uses six stable Axis colors only at the trace points and labels. The
shape and spoken labels still carry the readings, so color never becomes the
only source of meaning. Its public Axis name is Self-command, not Appetite;
the prototype retains the old stored key only so existing local journeys load.

Maintain WCAG AA contrast for body text. Never use color as the only carrier of
meaning.

## Typography

Barlow Condensed is the directional voice. It gives short statements,
commitments, and actions the vertical force of instrument lettering without
turning the app into a poster. Assessment questions use Inter in sentence case
so a person can understand them before judging the answers; a key second-person
word may move from 400 to 500 for eye guidance, never to imply a preferred
answer. Inter is also the plain explanatory voice. JetBrains Mono is the factual
voice, reserved for direction, deadlines, counts, and compact labels.

Condensed display type uses 600 and 700; body and factual type use 400 and 500.
Uppercase is allowed for short directional statements and decisive actions,
but never for assessment prompts or explanatory paragraphs. Those remain
sentence case.

## Layout

North is mobile-first and composed around one physical instrument rather than a
stack of cards. Use safe areas, a strong left edge, controlled crop, and enough
negative space for the live action to remain unmistakable. Primary copy uses
24px horizontal insets. The Compass may crop beyond that grid, but never through
functional copy. Answer controls are complete, full-width measured plates.

Today, Log, You and onboarding share one obsidian field with the crosshair grid
and two faint signal glows. The Compass owns the upper field. Copy and controls
sit on Liquid Glass plates inside that field; the page never switches to a
light surface halfway down.

The oversized instrument is allowed to cross a plane seam, never functional
copy or controls. Progress, metrics, destination labels, prompts, and actions
occupy protected lanes that remain fully visible at every supported phone
width.

One screen should expose one primary decision. Secondary actions may follow the
primary action, but must not compete with it. Layout is allowed to evolve from
the HTML prototypes; the one-purpose rule is not.

After onboarding, North has three tabs in the system Liquid Glass tab bar:
**Today**, **Log** and **You**. Today shows the Compass, the Direction readout,
and then one of three states: two Suggestions to pick from, the Open Action with
its source and Check-in time, or the Check-in itself (done, partly, missed).
Log lists checked-in Actions with their sources. You shows the North Star and
Reality, with Settings behind the gear. Taking an Action and checking in happen
in native sheets. A miss has no sound or haptic.

Onboarding asks for the person's name first. On the next screen a large Compass
calibrates once from 38 degrees to north, then the title and two lines reveal in
sequence and Start onboarding becomes active. Reduced motion shows the settled
Compass and copy with the action ready. From the questions onward a small
Compass sits in the trailing corner and points where the answers so far lead.

During onboarding, every question prompt starts in the same fixed lane below
the Compass; its vertical position must not depend on the prompt length or the
instrument beneath it.
The prompt and instrument form one vertical scroll surface, so long copy,
dynamic type, and every answer remain reachable on compact phones without
horizontal scrolling. Primary continuation actions remain fixed above the
bottom safe area. Onboarding prompts step down from 32px to 30px on compact
phone windows; the instrument does not lose options to preserve the type scale.
On every reversible step, Back sits directly beneath the primary action in that
same bottom lane. It is a full-width 44px target with quiet styling: easier to
reach than top chrome, but clearly subordinate to moving forward.
Two-door questions remain side by side where each answer has a readable lane;
below 360px they stack vertically rather than compressing or clipping their
sentences.

## Elevation & Depth

Depth comes from the Compass, the crosshair field, and Liquid Glass. Since
2026-11-24 North uses iOS 26 Liquid Glass through `expo-glass-effect`: buttons,
cards, grouped settings and the button stacks that merge under
`GlassContainer` are glass, and the tab bar, sheets and navigation headers are
the system's own glass. The field behind them is black with the crosshair grid
and two faint signal glows, so the glass has something to refract. Where Liquid
Glass is unavailable (older iOS, Android, the web preview) the same shapes are
drawn with `glass-fill` and a `glass-edge` hairline. Avoid neon bloom and
gradients on content.

## Shapes

Use 10px radii for controls and 16px for instrument plates. These are machined
corners, not friendly pills. Circles belong to selectors, hubs, and the Compass.
Do not put every paragraph in a container.

## Compass

North has one instrument.
The Compass (`DirectionCompass`, direction domain) is a thin ring on the
crosshair field: 72 ticks, four longer cardinal ticks, a Signal-red `N`, a red
needle with a short slate tail, and a red hub. The needle points at the
Direction, clockwise from north. A lit trail runs along the ring from where the
Journey started to the needle, brightest at the needle and fading toward the
start, with one lit dot at the needle's end. The needle is the only spring.
Boot and the onboarding welcome calibrate it once from 38 degrees to north.
During onboarding a small Compass sits in the trailing corner and points where
the answers so far lead.

## Motion

North moves like an instrument, not an interface. Everything decelerates into
place; nothing accelerates, bounces, or arrives early. `easing-standard` is the
default curve. `instant`, `quick`, and `settle` cover ordinary interaction;
`arrival` is reserved for the boot-to-welcome reveal and the Compass's one
calibration. `boot-hold` is the minimum in-app splash duration; loading
may extend it, but never shorten it. Reach for `quick` unless one of the
authored moments below calls for another token.

- **The needle is the only spring.** One physical object, the way there is one
  live signal. Its damping, stiffness, and mass are tokens because they are
  design decisions, not implementation detail. Everything else in the product
  uses a decelerating curve.
- **The needle never overshoots north.** The tokens are tuned to settle in
  roughly 700ms without crossing the direction it is moving to. A compass that
  wobbles past its reading is a toy, and the whole product rests on this object
  being believable.
- **The needle moves once per closed action, and the person watches it.** The
  rest of the screen holds still while it does. This is North's only
  celebration, and it lasts less than a second.
- **The first arrival is authored once.** The system splash hands its static
  split gate to the in-app mark; that mark dissolves into the Compass, whose
  needle settles on north before welcome follows. Today remains already there
  on cold start.
- **Nothing breathes.** No pulse, shimmer, skeleton wave, or looping hint.
- **The initial direction is calculated, not fetched.** It is derived after the
  person chooses a North Star, stored when onboarding ends, and shown on the
  Direction surface. There is no waiting screen or simulated computation.
- **North Star candidates begin unselected.** Browsing changes only the life in
  view. The person must explicitly choose one before the fixed Continue action
  becomes available.
- **Reality calibrates once.** After the six Axis chapters are answered, the
  six trace points resolve from the centre in one finite, overlapping sequence.
  The final shape and all six broad readings remain still and capture-ready.
  Reduced Motion shows the complete trace immediately. This is explanation,
  not loading, and it happens before North Star reflection begins.
- **Content arrives through `Reveal`, and only when the person caused it.** A
  short rise and fade over `quick`. Layout animations are not used: they do not
  run on the web preview surface, so the same fade would need a second
  implementation per screen to stay visible while developing.
- **Today, Log and You are native tabs; Settings and The Code push with the
  system back gesture.** Take it, Check-in and Note use native form sheets. A
  Check-in returns to Today, where only the needle moves, then the next two
  Suggestions arrive through `Reveal`.
- **Press feedback is `press-scale` and `press-opacity` over `instant` in and
  `quick` out.** A flat opacity dip is the least considered feedback available.
  The scale is deliberately at the strong end of the subtle band: below about
  0.97 a press stops being felt on a full-width control, and an unfelt press
  reads as an interface that did not hear you. It is a transition, never a
  style swap — a scale that arrives in one frame is a jump, not feedback.

Never use celebratory motion, confetti, shaking, or pulsing pressure.

Under the system reduced-motion setting, all nonessential animation is removed.
The needle is the exception and must not simply be disabled: it cross-fades
between its old and new direction over `settle` instead of sweeping. The direction
change stays perceptible; only the sweep goes.

## Sound and haptics

Sound is rare enough to mean something. North has three sounds, and that number
is a budget rather than a starting point. All three are dry, single events with
no reverb, no rising interval, and no layering.

| Cue | Character | Budget |
| --- | --- | --- |
| Close out | One low wooden knock. The sound of a thing set down, not a prize. | `close-out` |
| Direction move | One brass tine, plucked and decaying, under the needle. | `direction-move` |
| Reach north | The tine an octave up, alone. Plays once in a person's lifetime. | `reach-north` |

Nothing else makes a sound. Not navigation, not button
presses, not saving a note, not choosing a deadline. **A missed deadline is
silent** — an interface that buzzes at a person for stalling has already broken
the promise that inactivity is not punished.

Sound respects the device silent switch, never plays when the system
reduced-motion setting is on, and is never the only carrier of meaning. Haptics
follow the same logic: light impact on a primary press, selection ticks in the
deadline picker and one success notification on closeout. There is no haptic
for a miss, an overdue state, or an error.

## Components

- **Primary action:** Full width on mobile, current Signal fill, obsidian text,
  10px radius, condensed uppercase label, and a right-facing directional mark.
- **Quiet action:** A tonal black plate with a thin steel edge. It follows,
  rather than sits beside, the primary action on narrow screens.
- **Metrics:** Mono only. Live direction uses the current Signal; completed or held
  facts use chalk or the Signal's light tone. Present numbers plainly, without badges or
  score effects.
- **State lesson:** A short text block with a restrained two-pixel semantic edge.
  It explains the moment; it does not become an alert banner.
- **Action detail:** An obsidian surface with one compact mono label and human prose.
  Do not style it as evidence, verification, or a social artifact.
- **Compass:** A sparse instrument, not a gamified progress ring, and the one
  object in North that is drawn rather than laid out. It should normally be
  oversized and may crop against the viewport so it defines the page rather
  than sitting inside it as a widget. At the `compass` size
  token it is two concentric hairline rings inset roughly 10px from each other,
  an `N` in mono label type at the top of the outer ring, a Signal-colored north needle
  running from the hub to just inside the inner ring, a dimmed south needle at
  about a fifth of that length, and a machined dark hub. North is always screen-up
  and the needle carries the direction; the dial never rotates under a fixed
  needle. It must stay readable with motion removed and must state its direction
  through its accessibility label, because a person using a screen reader cannot
  watch it move.

### Component inventory

Everything below is built. Compose from it before adding anything new, and put
a new primitive in `src/components/ui/` only when it is genuinely
product-agnostic — anything that knows what a Direction or an Action is belongs
to its domain's `ui/` folder instead.

| Primitive | Use it for |
| --- | --- |
| `NorthScreen` | Every scrolling screen body. Owns insets, gutters, and rhythm. |
| `NorthText` | All type. `display`, `title`, `heading`, `body`, `small`, `label`, `data`. |
| `NorthButton` | Primary, secondary, and quiet actions, with the press transition. |
| `NorthField` | Anything a person types. |
| `NorthAuthField` | A labelled single-line identity field with focus, visibility, and inline-error states. |
| `GearMark` | The one content icon: a gear-only control at the top right of You that opens Settings. |
| `NorthRow` | One line of a list: label, detail, and a value or a control. |
| `Section` | A labelled group in the single column, optionally ruled. |
| `Surface` | A contained fact, such as the Named Action. |
| `Metric` | A mono fact with a label. Tones: default, earned, overdue. |
| `Reveal` | The one way content arrives. See Motion. |
| `Compass` | The instrument, where the instrument is the subject. |
| `NorthMark` | The split-gate product mark. Its frame stays still; boot and the first pre-auth welcome may calibrate its independent red needle once. |
| `InstrumentSlider`, `ChoiceInstrument` | Onboarding instruments. Reusable anywhere a graduated value is set. |
| `ProgressRail` | Position in a long flow. |

Domain UI that is not a primitive: `DirectionCompass` (direction), `LineCard`
(content), `NorthStarPortrait` (onboarding). Glass primitives: `GlassSurface`,
`GlassGroup` (`@/components/ui/glass`).

## Platform surface

North uses native chrome and bespoke content, and the line between them is not
a matter of taste.

Anything the operating system owns — the navigation stack, sheets
and their detents, the keyboard, scroll physics, text selection, context menus,
share, and the system back gesture — uses the real native component, adjusted
only for color. These are the parts a person already knows how to use, and
reimplementing them in JavaScript makes the product feel cheaper, not more
designed.

Today, Log and You sit in the native tab bar. Take it holds the Days and the
optional rewording in one native form sheet; Check-in and Note are native form
sheets too. Dismissing Take it discards its draft. Web is a development preview
with the same routes; its tab switcher sits at the top. It does not redefine native sheet or back-gesture behavior.

The onboarding Reality card is a North-owned image surface. Save image writes
the captured card to Photos after the system grants add-only access. Do not
open a share sheet from onboarding; leaving the flow competes with completion.
The utility control is never inside the captured image.

Anything North owns — the compass, the daily line, metrics, the action detail,
and the primary action — is drawn from these tokens
and never inherits system appearance. Do not adopt platform semantic colors;
North has one fixed obsidian/chalk structure and one authored Signal identity;
system colours would fight both.

North adopts the platform's Liquid Glass for chrome and keeps its own palette
for everything it draws: the system tab bar, sheets and headers stay glass and
are tinted with the Signal, never recoloured with a solid background.

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
- The direction announces itself as a plain fact when it changes, because the
  needle's movement is the only place that information exists otherwise.
- Under reduced motion, the app removes animation but never removes
  information. See Motion for the needle's cross-fade.

## Do's and Don'ts

- Do make the live action visually inevitable.
- Do challenge behavior with direct, unsentimental copy.
- Do state missed deadlines factually and leave the door open.
- Do keep the designed exit visible as the direction approaches north.
- Do connect the selected Signal elements into one directional path; do not scatter accent color.
- Do let the needle be the only thing moving when it moves.
- Do keep a missed deadline silent, still, and unbuzzed.
- Do not create dashboards, feeds, badges, levels, trophies, or leaderboards.
- Do not add a fourth sound, a looping animation, or a success chime.
- Do not set paragraphs in caps or use exclamation marks, hustle language, or motivational shouting.
- Do not add a character or a coach voice.
- Do not add reminders beyond the one Check-in he turned on. North stays quiet by design.
- Do not use visual pressure to manufacture retention after the user reaches the
  exit.
