# Main surface design

Date: 2026-08-25

## Problem

North's bespoke instrument is recognisable, but the post-onboarding shell still
reads like a conventional 2020 tab app: a permanent boxed strip, document-like
pages, repeated headings, and too much prose competing with the thing a person
opened the app to see.

This note settles the main-surface hierarchy and motion. `DESIGN.md` remains the
durable visual contract.

## Research

- Apple's current tab-bar guidance treats tabs as persistent top-level
  destinations, recommends few stable destinations with labels and familiar
  symbols, and keeps actions out of the tab bar. On current iOS, the bar floats
  above content and can minimize while a person scrolls.
  [Apple tab bars](https://developer.apple.com/design/human-interface-guidelines/tab-bars)
- Apple's motion guidance says motion should communicate state or causality,
  remain brief and precise, and avoid custom treatment on frequent interactions.
  Tab changes therefore use the platform transition; North does not slide peer
  destinations left and right.
  [Apple motion](https://developer.apple.com/design/human-interface-guidelines/motion)
- Apple's current design-system sessions emphasise content hierarchy, removing
  unnecessary backgrounds, and letting standard navigation remain fluid and
  interactive. North adopts the hierarchy and system behaviour without adopting
  translucent glass, which conflicts with its physical obsidian material.
  [Apple design system](https://developer.apple.com/videos/play/wwdc2025/356/)
- Android's current guidance is similarly content-first: draw the environment
  edge to edge, inset critical controls, and let bottom chrome collapse where
  the platform supports it. Primary navigation stays familiar and uses three to
  five destinations.
  [Android edge-to-edge](https://developer.android.com/design/ui/mobile/guides/layout-and-content/edge-to-edge)
  [Android navigation patterns](https://developer.android.com/design/ui/mobile/guides/layout-and-content/layout-and-nav-patterns)
- Expo Router's `NativeTabs` exposes the real platform controls, automatic
  insets, and iOS 26 tab-minimisation behaviour. It remains authoritative for
  the shipping app.
  [Expo Router native tabs](https://docs.expo.dev/versions/latest/sdk/router/native-tabs/)

## Decisions

### Three destinations, three jobs

| Destination | Question it answers | Dominant visual |
| --- | --- | --- |
| **Now** | What is live, and what do I do next? | Mascot and open Action state |
| **Direction** | Where am I relative to North? | Standalone needle compass with the current reading inside it |
| **You** | Who did I choose, and where do I stand? | North Star portrait and six-color Reality trace |

The first destination is the homepage and uses the native Home symbol. Public
routes and stored compatibility names do not change.

### Navigation

- iOS and Android use `NativeTabs`, three icon-only destinations with stable
  accessibility labels, native symbols, and platform press/selection behaviour.
- The tab bar may minimize on downward scroll. It never disappears permanently.
- The web development preview uses a compact floating instrument dock with three
  stable peer destinations. Direction is an 88px circular centre target crossing
  the dock symmetrically, with a larger true compass mark and a distinct raised
  inactive field. It uses the current Signal only while selected. Home and You
  use circular inner selections. The dock is
  an inspection aid, not a fourth navigation implementation to ship.
- The active destination uses one connected Signal state. Inactive chrome
  is steel. No blur, glow, gradient, or floating-glass material is introduced.

### Surface hierarchy

- Each destination begins with its visual subject, not a title explaining the
  subject.
- North's face persists on Now as the live state instrument. Direction and You
  deliberately do not repeat it as decoration.
- Direction carries current position and North on one dial. Tapping the dial
  temporarily rewinds its needle to the onboarding position, then back to now;
  it never repeats the same state as a second chart or prose explanation below.
- Repeated prose becomes a caption, a measured fact, or disappears.
- Hairlines group related facts. Cards are reserved for genuinely contained
  objects; they are not the default page structure.
- Critical copy and controls keep the 24px protected lane. Instruments may crop
  outside it, never through it.

### Motion

- Switching tabs uses the operating system transition. Peer destinations never
  slide horizontally.
- The active state in the web preview dock settles over `quick`; pressing a tab
  uses the standard press compression.
- A destination does not replay entrance choreography merely because it became
  visible. Existing state is already there.
- State caused by the person may still arrive through `Reveal`. Direction change
  remains the one spring-authored movement, owned by the needle.
- Nothing loops, pulses, shimmers, or animates to make an idle page look alive.

## Acceptance

- At 430x932 and 320x568, no main destination horizontally scrolls, clips its
  primary control, or places functional copy beneath the instrument or tab bar.
- The current destination is identifiable through the native symbol, selection
  field, and contrast—not colour alone. Accessibility names every destination.
- Each destination's first viewport has one obvious subject and no dashboard
  grid.
- Reduced-motion preserves state changes and removes spatial flourish.
