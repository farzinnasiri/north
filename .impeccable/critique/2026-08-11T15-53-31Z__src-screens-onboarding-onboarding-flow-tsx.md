---
target: North onboarding
total_score: 21
max_score: 40
na_heuristics: 
p0_count: 1
p1_count: 8
timestamp: 2026-08-11T15-53-31Z
slug: src-screens-onboarding-onboarding-flow-tsx
---
# North onboarding — aggressive UI/UX critique

## Diagnosis

North's onboarding is a generic survey wizard wearing an instrument skin. The shared frame is a normal vertical document stack—header, prompt, child control, brass action—so every primitive's height moves the action and most modes inherit the same bordered-box vocabulary. Restraint has become sparse styling rather than deliberate phone composition. The browser weakens native haptics, age picking, and gesture feel, but it does not cause the unstable action position, unused lower viewport, anonymous name fields, generic sliders, missing day-bar geometry, static-looking rank, or weak signature ceremony.

## Nielsen heuristic score

| Heuristic | Score | UI evidence |
| --- | ---: | --- |
| Visibility of system status | 2/4 | Status exists, but the proprietary compass is replaced by generic wizard chrome and selected/default readings can look equivalent. |
| Match with the real world | 3/4 | Compass, time arc, tally, and signature metaphors work; rank, day, mirror, and duration often look like ordinary controls. |
| User control and freedom | 3/4 | Back and clear actions exist; long-list action placement and keyboard behavior remain unpredictable. |
| Consistency and standards | 3/4 | Tokens and vocabulary are coherent, but one universal geometry erases mode-specific behavior. |
| Error prevention | 2/4 | Required discrete answers are gated, but some default readings can be committed untouched and arc drag mapping does not match the drawn stops. |
| Recognition rather than recall | 2/4 | Rank dragging is visually undiscoverable; five blank slots lack identity; North Star overloads comparison. |
| Flexibility and efficiency | 2/4 | The linear flow is intentional, but keyboard and long-content layouts do not adapt cleanly. |
| Aesthetic and minimalist design | 2/4 | Strong palette and type; excessive sameness and unused lower halves make the UI feel unfinished. |
| Error recovery | 1/4 | Back and signature clear are present; custom control correction states are weak. |
| Help and documentation | 1/4 | Custom reorder, tally-at-zero, and signature interactions lack sufficient visible instruction or equivalent affordances. |
| **Total** | **21/40** | **Major composition and interaction-specificity work remains.** |

## Design specificity

Across 31 steps: roughly **8 authored, 10 mixed, 13 generic**. Time-since, two-door, bearing, and parts of the contract establish the quality bar. Profile, situation, spectrum, name slots, stepper, day bar, multi-select, duration, mirror, honest text, North Star catalog, and North Star meaning largely fall back to standard form patterns.

## Priority issues

| Severity | Finding | Evidence | Consequence |
| --- | --- | --- | --- |
| P0 | Signature is gesture-only. | `signature-pad.tsx` exposes a pan surface with `accessibilityRole="none"` and no equivalent completion act. | Some users cannot complete onboarding. |
| P1 | Primary action has no stable phone position. | Measured Y positions range from 327 to 628 on the same 430×932 viewport; bottom gap ranges from 252 to 553. North Star and Code place the action below the viewport. | The hand must relearn the action position on every screen. |
| P1 | The instrument never owns the remaining viewport. | `OnboardingFrame` is a gapped stack; its instrument has only `minHeight: 120`. | Controls are top-stacked and the lower half becomes arbitrary void. |
| P1 | Distinct readings collapse into generic form geometry. | Spectrum, day bar, duration, gap, and mirror reuse one 3px slider; name, rank, choices, tally, and signature reuse bordered dark rectangles. | Modes feel interchangeable and boring. |
| P1 | The specified day bar is missing. | A1 routes through `InstrumentSlider`; there is no 24-hour visual geometry. | A day is presented as a relabeled settings slider. |
| P1 | Name slots are anonymous boxes. | Five blank `NorthField`s with identical borders and no slot identity or focus sequence. | The quietest question feels clerical and accusatory. |
| P1 | Motion animates the wrong layer. | The whole reflowing document enters over 150ms/8px; the old screen disappears immediately; header and action move with content. | Motion cannot create continuity or mask the button jump. |
| P1 | Time-arc drawing and input mapping disagree. | Stops use a quadratic curve; drag selection maps Y linearly. | The best custom instrument can select a different stop than the finger indicates. |
| P1 | Keyboard and scrolling have no explicit layout strategy. | The whole screen is one `ScrollView`; focused fields and the action remain in the same document flow. | Text-heavy screens will shift or hide the action unpredictably on device. |
| P2 | Rank looks static. | No visible manipulation affordance, lift state, or neighbor displacement. | Users may record the default without discovering drag. |
| P2 | North Star is an eight-card catalog. | All destinations and details are stacked; action is below the first viewport. | The highest-comparison decision arrives at the fatigue peak. |
| P2 | Full bleed is implemented inside a generic choice primitive. | Negative screen margins live in `ChoiceInstrument`. | Web horizontal-scroll retention and later header clipping remain plausible. |

## Motion review

| Before | After | Why |
| --- | --- | --- |
| Entire header, prompt, instrument, and CTA mount from `opacity: 0; translateY(8)` over 150ms | Keep shell fixed; crossfade/translate only prompt and instrument with direction-aware forward/back motion | A stable chassis creates spatial continuity and prevents the CTA from appearing to teleport. |
| Incoming-only web transition | Brief outgoing + incoming overlap within a fixed content stage | A real crossfade is perceptible; an incoming mount over a reflow is not continuity. |
| Instant Pressable scale/opacity state | Tokenized 90–150ms interruptible press transition | Current values are correct but snap rather than animate. |
| Static progress-width replacement | Discrete user-triggered compass/meridian resolution | Progress should express North's proprietary instrument rather than generic wizard status. |
| Rank row snaps back with no neighbor choreography | Quick row lift, target gap, and timed neighbor displacement | Reordering must show what will move before release. |

**Motion verdict: Block.** The current motion is technically present but perceptually insufficient and attached to the wrong structural layer. Reduced-motion handling exists, and no prohibited looping or spring misuse was found.

## Primitive verdicts

| Primitive | Verdict |
| --- | --- |
| Time-since | Strong visual seed; must center better and match drag geometry to stops. |
| Two-door | Strong concept; should own a full-bleed stage at the screen level, not sit as two cards above a generic footer. |
| Tally | Distinct after input; empty state is a vacant card and marks should dominate the count. |
| Spectrum / mirror | Generic settings slider; insufficient visual mass and no mode-specific geometry. |
| Recognition | Quieter ruled list, still a drifting option stack. |
| Name slots | Hard fail; five anonymous rectangles are not protected reflection. |
| Stepper | Clear and accessible, but visually and vertically stranded. |
| Day bar | Missing as a distinct primitive. |
| Multi-select | Efficient checkbox grid, not an authored appetite reading. |
| Duration / gap | Useful readout, generic slider geometry. |
| Rank | Static-looking and gesture-undiscoverable. |
| North Star | Exhausting catalog; needs staged overview/detail or paging. |
| Bearing | Strongest composition; demonstrates the value of a centered focal object. |
| Signature | Custom behavior without enough stagecraft or accessibility. |

## Browser-specific versus genuine

Browser-specific or unproven: the native age wheel, haptics, sound, safe-area behavior, software keyboard movement, and gesture competition. The Expo lightning badge is development tooling. Some archived clipping appears to be retained horizontal web scroll or stale capture state.

Genuine across platforms: unstable action placement, no centered instrument stage, repetitive wizard shell, missing day-bar geometry, anonymous name slots, undiscoverable rank, inaccessible signature, mismatched arc hit mapping, North Star overload, and motion attached to the whole reflowing document.

## Redesign directions

1. **Compass as chassis.** Fixed safe-area header, bounded prompt zone, flexible centered instrument stage, fixed keyboard-aware action dock, and four explicit layout archetypes: calibrated reading, full-bleed binary, keyboard/reflection, reading/ceremony. Highest specificity and highest implementation cost.
2. **Quiet field journal.** Stable header/footer, ruled rather than boxed inputs, Axis chapter transitions, better manipulation states, and staged North Star detail. Faster and safer, but risks remaining a premium survey.

Recommendation: **Compass as chassis.** This onboarding carries too much of North's identity and asks too much time to remain a refined questionnaire.

## Non-negotiable layout invariants

- Header and action dock remain stationary; only prompt and instrument transition.
- Standard action uses one fixed bottom-safe-area Y position across non-reading screens.
- The instrument occupies and centers within `viewport - header - prompt - action dock`.
- Only the middle region scrolls; long content receives dock-height bottom inset.
- Keyboard raises the dock and shrinks/scrolls the middle stage without hiding the focused field.
- Full-bleed binary and ceremony layouts are owned by screens, not negative margins inside generic components.
- Shared language comes from marks, axes, readouts, materials, and motion—not identical rounded rectangles.
- Forward/back motion is directional, quick, interruptible, and limited to the changing middle stage.
- Selection feedback is mode-specific: stop growth, fill movement, tally addition, row lift/gap, signature ink state.
- The final bearing remains the only spring.
