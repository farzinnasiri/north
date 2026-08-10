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
  surface: "#0F1319"
  surface-container: "#12161C"
  surface-container-high: "#1A1F27"
  outline: "#2A3038"
  outline-soft: "#20262E"
  on-surface: "#F2F0EB"
  on-surface-muted: "#9BA3AD"
  on-surface-subtle: "#6B6E73"
typography:
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
  screen-horizontal: 22px
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
  routine use destroys its weight. The current ember-light token does not meet
  AA contrast for normal text on field; use it as an edge or non-text mark and
  keep warning copy in paper until an accessible text variant is approved.
- **Paper (`on-surface`):** Warm `#F2F0EB`, never pure white. It keeps the UI
  from becoming clinical.
- **Ash and slate:** Supporting copy, metadata, and labels. They create hierarchy
  without adding decoration.

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

## Elevation & Depth

Depth comes from tonal layers and half-strength borders, not shadows. The field
deep color is the canvas, field is a contained surface, and field raised is an
interactive or selected layer. Avoid floating glass, glow, gradients, and heavy
drop shadows.

## Shapes

Use 8px radii for controls and contained action details, 12px for larger cards,
and pill shapes only where the object is genuinely circular or capsule-shaped.
The compact radii keep the interface considered without making it playful.

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
- **Compass:** A sparse instrument, not a gamified progress ring. Its motion
  should be physical and calm, and it must remain understandable without motion.

Interaction transitions should usually finish around 150ms. Respect reduced
motion by removing nonessential transitions. Never use celebratory motion,
confetti, shaking, or pulsing pressure.

## Do's and Don'ts

- Do make the live action visually inevitable.
- Do challenge behavior with direct, warm, unsentimental copy.
- Do state missed deadlines factually and leave the door open.
- Do keep the designed exit visible as the bearing approaches north.
- Do use one brass element in view; do not scatter accent color.
- Do not create dashboards, feeds, badges, levels, trophies, or leaderboards.
- Do not use caps, exclamation marks, hustle language, or motivational shouting.
- Do not make the mascot speak, nag, celebrate, or become a coach.
- Do not add reminders or notifications. The signed contract owns that promise.
- Do not use visual pressure to manufacture retention after the user reaches the
  exit.
