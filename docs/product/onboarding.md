# Onboarding

Specification for North's onboarding. Self-contained: an implementing agent
should not need any other conversation, only `DESIGN.md`,
`UBIQUITOUS_LANGUAGE.md`, `north-product-spec.html`, and `north.html`.

Settled 2026-08-11. Sections marked **OPEN** are not implementation
requirements and must not be guessed.

## What this produces

Onboarding exists to produce exactly two things. Everything else in it is in
service of those two, and anything that serves neither should be cut.

1. **The initial Bearing** — one number, 0–180°, from twenty scored questions
   across five Axes.
2. **The North Star** — the kind of man he chooses to walk toward.

It ends with a signed contract, which is what replaces notifications. The
signature is load-bearing, not decoration.

## Length and the promise

Sixty-four screens, roughly sixteen minutes.

`north.html`'s first-open screen currently promises "about four minutes." That
copy is wrong for this flow and must be changed to the real number. A man told
four minutes who is on minute eleven feels handled, and that is the wrong
feeling to carry into signing a contract. State the truth and make the length
the point:

> This takes about sixteen minutes. It is the longest I will ever ask for.

## The six Axes

Grounded in Lerner's 5C model of positive youth development — validated
repeatedly on emerging adults, which is exactly the primary audience — fused
with the Boundaries crisis from the founder's typology, plus two dimensions
neither framework has because neither was written for this decade.

| Axis | Measures | Moved by |
| --- | --- | --- |
| **Frame** | Whether he holds a position or dissolves to be liked | Saying the unpopular thing, refusing, setting a term |
| **Desire** | Whether he pursues what he wants or has pre-rejected himself | Approaching, asking, risking the no |
| **Connection** | Whether he initiates and sustains bonds or waits to be reached | Reaching first, staying in touch, being honest with a friend |
| **Appetite** | What owns his hours, and whether he governs it or it governs him | Going without, changing what he reaches for |
| **Craft** | What he has built — capability and body both | Training, finishing, learning something that would survive losing everything else |
| **Agency** | Whether he believes he is the one choosing | Any kept commitment; this is the Axis the whole product is built to move |

Craft covers the body deliberately. The body is the first thing a man builds,
and for most of this audience it is the door they came through.

**Agency was added on 2026-08-12** and is the only Axis that measures stance
rather than conduct. Two men can give identical answers on the other five, and
the one who believes he chose them is a different man from the one who believes
it happened to him. It rests on four validated constructs — locus of control
(Rotter), self-efficacy (Bandura), future self-continuity (Hershfield), and
autonomy from self-determination theory — and it passes the movability test
better than anything else here: Bandura's primary source of self-efficacy is a
mastery experience, and a Closeout is a mastery experience. The product's core
mechanic is the intervention for this Axis.

**5C's Character is deliberately absent.** Integrity is what every Closeout
measures. It is the medium the whole compass runs on, not one dimension of it.
Scoring it separately would make the Bearing partly measure itself.

## The North Star

Uses the founder's eight-type framework as the destination picker.

| Type | Poles | Shorthand |
| --- | --- | --- |
| The Patriarch | Ambitious, Committed, Disagreeable | Builder and protector |
| The Modern Man | Ambitious, Committed, Agreeable | Career and equal partnership |
| The Rogue | Ambitious, Bad Boy, Disagreeable | Dominant, high-risk, unattached |
| The Laughing Wolf | Ambitious, Bad Boy, Agreeable | Charming socialite |
| The Godfather | Satisfied, Committed, Disagreeable | Built it already, protects it now |
| The Kind Father | Satisfied, Committed, Agreeable | Harmony above all |
| The Freethinker | Satisfied, Bad Boy, Disagreeable | Own rules, own pleasure |
| The Playboy | Satisfied, Bad Boy, Agreeable | Hedonism without the edge |

**Hard rule: these are destinations he chooses, never diagnoses of what he is.**

The source framework describes some types as non-viable and unmatched. North
must never say that to a person about himself. It breaks *challenge the
behaviour, never the man* and *flexible, not one template of a man*. Onboarding
asks who he is walking **toward**. It never labels what he currently is, never
scores his type, and never tells him a type is wrong.

Present types through fictional and real entry points, per the product spec —
the source material already supplies Tommy Shelby and Brando for the Godfather.
Each type needs two or three recognisable figures, authored by hand.

## Flow

| # | Movement | Screens | Cost to him |
| --- | --- | --- | --- |
| 0 | The promise — the exit, stated before anything is asked | 1 | none |
| 1 | Profile | 3 | taps |
| 2 | The twenty questions | 20 | taps, drags, a little typing |
| 3 | One honest thing | 1 | typing |
| 4 | North Star | 2 | taps, then typing |
| 5 | The reading — the needle settles, the Bearing is revealed | 1 | none |
| 6 | The code, the letter, the signature | 3 | highest |

Two orderings matter and are not negotiable:

- **The Bearing is revealed before the contract.** The number creates the stakes
  the signature answers. Reversed, the signature is abstract.
- **The quit statistic appears immediately before the signature**, never at the
  start. Defiance requires something already invested to defend.

### Movement 0 — the promise

No input. States that North is built to be outgrown, gives the honest time
estimate, and offers the code as an optional read (per `north.html`, the code is
offered once and never pushed).

### Movement 1 — profile

Three questions. Each must change something downstream or be cut; an unused
field costs trust in an app whose pitch is that it does not waste touches.

| Field | Interaction | What it changes |
| --- | --- | --- |
| Name | Single-line text, given name only | Addressed by name in the letter, the contract, and the Exit |
| Age | Native wheel picker, 16–60 | Personalises the quit statistic; gates content references |
| Situation | Three buttons: studying, working, neither | Selects Craft content; "neither" is not treated as failure anywhere |

## The thirty-five questions

Five per Axis, six for Frame and Appetite, eight for Agency. One question per
screen, one commit action per screen.

The Axes no longer hold equal counts, so the flow groups questions by their own
`axis` field rather than by arithmetic on an index.

**Every input is an instrument reading, not a form control.** This is the rule
that makes the variety coherent rather than decorative: North is a compass, and
each of these is a gauge being taken. Nothing here is a quiz, nothing is scored
aloud, and nothing is celebrated.

`off` is the score each question contributes: **0 means on-course for that Axis,
100 means maximally off.** Higher is further from north.

### Frame

**F1 · Time-since arc**
> When did you last say what you actually thought to someone who wouldn't like it?

Drag a marker around a quarter-arc. Stops: today, this week, this month, months
ago, I can't remember. `off` = 0 / 20 / 45 / 75 / 100.

**F2 · Two-door**
> Someone says something you think is wrong. What actually happens?

Full-bleed split screen, two panels, no neutral option and no third door.
"I say it." / "I let it go." `off` = 10 / 90. The absence of a middle is the
design: a five-point scale collects a middle answer from exactly the men who
most need a real one.

**F3 · Tally**
> Last month, how many times did you agree to something you didn't want to do?

Tap once per instance. Marks accumulate as small mono strokes, counting up.
There is no maximum and no cap message. `off` = min(count × 12, 100).

**F4 · Spectrum drag**
> Which do you actually optimise for?

Two poles, "Being liked" and "Being respected," with a draggable marker and no
labelled midpoint. `off` = position from the respected end, 0–100.

### Desire

**D1 · Time-since arc**
> When did you last walk up to a woman you didn't know and start a conversation?

Stops: this week, this month, this year, years ago, never. `off` = 0 / 25 / 55 /
80 / 100. Expect a large share to answer "never" — 45% of men aged 18–25 have
never done it once. The "never" stop must be rendered with exactly the same
weight as the others. No ember, no emphasis, no comment.

**D2 · Tally**
> Last month, how many times did you want to say something to someone and didn't?

Same primitive as F3. `off` = min(count × 10, 100).

**D3 · Spectrum drag**
> Do you think you're allowed to want what you want?

Poles: "Not really my place" and "Yes, without apology." `off` = position from
the apology-free end.

**D4 · Recognition list**
> And what do you tell yourself about why you didn't?

Single-select from authored excuses, each written in his own inner voice:

- She's probably taken.
- I'd be bothering her.
- It wasn't the right moment.
- I don't look like that.
- I wasn't really trying.
- I don't do that sort of thing.

`off` = 40 / 55 / 60 / 85 / 90 / 75. Recognising his own excuse in a list
someone else wrote is the strongest *seen* moment available in the whole flow.
Do not add "none of these" — it is an escape hatch from the point of the
question.

### Connection

**C1 · Name slots**
> Who would you call at 2am? Take your time.

Five empty slots, first-name entry, all optional. The empty slots are the
answer. No prompt to fill them, no encouragement, no count displayed. `off` =
100 − (filled × 20). This is the quietest and hardest screen in the flow; give
it more vertical space than any other and no time pressure.

**C2 · Time-since arc**
> When did a friend last ask how you were and wait for the real answer?

Stops: this week, this month, months ago, I can't remember, nobody does that.
`off` = 0 / 30 / 60 / 85 / 100. Context: 21% of men received emotional support
from a friend in the past week, against 41% of women.

**C3 · Stepper**
> In the last week, how many conversations did you start?

Large mono numeral, minus and plus either side, floor of zero. `off` =
max(100 − count × 14, 0).

**C4 · Two-door**
> Something good happens. Who do you tell first?

"Someone specific." / "Nobody, really." If he picks the first, a single name
field appears in place — still one question, one screen. `off` = 15 / 95.

### Appetite

**A1 · Day bar**
> Yesterday. How many hours went to watching other people live?

A horizontal bar representing twenty-four hours. He drags to fill the portion
that went to feeds, streams, and other people's lives. The filled region reads
in mono hours as he drags. `off` = min(hours / 8 × 100, 100).

**A2 · Multi-select**
> What do you reach for when the day goes badly?

Multi-select, unlimited: your phone, porn, weed, food, drink, games, the gym,
nothing. Multi-select rather than single is deliberate — forcing one answer
invites the flattering one. `off` = base 20 + 20 per selection from the first
six, capped at 100; "the gym" and "nothing" add 0.

**A3 · Duration slider**
> Whatever you reach for most — how long could you go without it before you'd notice?

Continuous slider labelled in mono: an hour, a day, three days, a week, longer.
`off` = 100 / 75 / 50 / 25 / 0.

**A4 · Gap slider**
> You told yourself five more minutes. How long was it actually?

Slider from five minutes to five hours, mono readout. The gap between what he
said and what happened is the score, and the screen never names that out loud.
`off` = min((minutes − 5) / 175 × 100, 100).

### Craft

**K1 · Stepper**
> How many things can you do well enough that someone would pay for them?

Same primitive as C3. `off` = max(100 − count × 25, 0).

**K2 · Time-since arc**
> When did you last finish something nobody made you finish?

Stops: this week, this month, this year, longer, I don't finish things. `off` =
0 / 25 / 55 / 80 / 100.

**K3 · Mirror slider**
> The body you have now. Is that the body of someone who keeps his word to himself?

Single unlabelled slider between "No" and "Yes" with no numbers and no midpoint
mark. Deliberately not a weight, a photo, or a body-fat estimate — North is
measuring conduct, not physique. `off` = position from the "Yes" end.

**K4 · Rank**
> Put these in the order you actually spend time on them. Not the order you'd like.

Drag to reorder: your body, your work or study, your skills, your friends,
your screen. `off` derives from the position of "your screen" — first place
scores 100, last scores 0, evenly spaced between.

### Interaction primitives to build

Nine reusable inputs cover all twenty questions. Build these as components in
`src/components/ui/`, not per-question:

| Primitive | Used by |
| --- | --- |
| Time-since arc | F1, D1, C2, K2 |
| Two-door | F2, C4 |
| Tally | F3, D2 |
| Spectrum drag | F4, D3, K3 |
| Recognition list | D4 |
| Name slots | C1 |
| Stepper | C3, K1 |
| Duration / gap slider | A3, A4 |
| Day bar | A1 |
| Multi-select | A2 |
| Rank | K4 |

Every one of them is buildable with the installed stack: Reanimated 4 for
transitions and drag values, `react-native-gesture-handler` for the arc, drag,
and rank gestures, `react-native-svg` for the arc and day bar.

## Movement 3 — one honest thing

A single free-text screen, placed after the twenty so that he answers it having
already invested.

> Name one thing you know you should have dealt with by now.

**Never scored.** It exists for ownership, and it is quoted back to him at the
Exit. Free text cannot be scored deterministically and v1 has no LLM; any
attempt to score prose here is out of scope and must not be added.

## The future-self domains

**Added on 2026-08-12.** Three screens, immediately after the alter ego and
before the reading — one for each horizon: two years, five years, ten years.
Each asks the same neutral question in a different frame ("a free evening,"
"a free weekend," "looking back") and offers the same four options as a
multi-select with no minimum and no maximum:

- Reads, listens to something, follows an idea (intellectual)
- Goes somewhere or does something that scares him a little (adventurous)
- Trains. Moves his body on purpose (physical)
- None of this. Something else entirely

**Never scored, and structurally cannot be.** These live outside `QUESTIONS`
entirely, in their own `futureSelf` field on the draft, so `getInitialBearing`
— which only ever reads `draft.answers` — cannot reach them even by accident.
This is deliberate: scoring intellectual, adventurous, and physical would
reward one specific silhouette — a man who reads, climbs, and lifts — over a
man who pictures something quieter, which is the exact stereotype this
question exists to avoid. Picking one domain, all three, or "something else
entirely" are equally valid answers, and the UI presents them with equal
weight: no chip is pre-selected, none is styled as the recommended choice, and
selecting more is not visually rewarded.

The data exists to shape which authored actions and lessons he is later shown
— the state machine described in the product spec's content engine section —
not to move the Bearing. That selection logic is not yet built.

## Movement 5 — the reading

The compass is the progress indicator for the entire flow. The needle begins
unsettled and drifting; each answer makes it more determined. This screen is
the needle finally coming to rest.

It is the only place in onboarding where the needle spring from `DESIGN.md`
runs. Under reduced motion it cross-fades to the final Bearing instead of
sweeping, per the Motion section.

State the number plainly and state what it costs. No congratulation, no
commiseration, and no interpretation of what the number says about him.

## Movement 6 — the contract

Three screens, in order.

1. **The code.** The manifesto from `north.html`, verbatim. Offered, scrollable,
   skippable.
2. **The letter.** Addressed to him by name. States plainly that he will outgrow
   this and that North intends to end. Immediately before the signature, and
   only here, the population statistic:

   > Forty-five percent of men your age have never once walked up to a woman and
   > said something. Not rejected. Never tried.
   >
   > Most men who start something like this stop before day twelve.

   Aimed at the population, never at him. This technique tapers as he
   progresses and must not appear again after roughly day forty.

3. **The signature.** Drawn, not typed — `react-native-gesture-handler` pan into
   an SVG path. A typed name is a form field; a drawn signature is an act. This
   is the single highest-cost interaction in the product and the only place in
   onboarding where a sound plays (`contract-signed`, per `DESIGN.md`).

## Scoring

Per-question `off` values are given above and are settled.

```
axisReading(axis) = mean(off) over that axis's four questions   // 0-100
```

**OPEN — the Bearing formula.** How five Axis readings collapse into one 0–180°
Bearing is not decided and must not be guessed. It is a values statement about
what North thinks a man is, not an implementation detail: equal weighting says
all five matter identically, and any other weighting says something specific.

Implement the seam, not the answer:

```ts
type AxisReading = { axis: Axis; off: number };          // 0-100
type BearingRule = (readings: AxisReading[]) => number;  // 0-180
```

Ship a single documented placeholder rule behind that type, keep it in the
`bearing` domain, and make it trivially replaceable. Do not spread scoring logic
across screens.

## Voice

From `north.html`, non-negotiable:

- Direct, warm, unsentimental. Somewhere between Mark Manson and David Goggins.
- Never "just", "simply", or "easy" — they condescend to a man finding it hard.
- Never king, brother, warrior, legend, champ.
- No caps, no exclamation marks, no emoji, no hype.
- Sentence case, ending in a full stop.

**Name the condition, locate the agency in him.** The rules of being a man
changed and nobody handed him the new ones; saying so is what earns his trust in
the first two minutes. But grievance and agency cannot coexist in this product —
if onboarding tells him the problem is entirely outside him, he has no reason to
use a compass, and every mechanism North has depends on him believing his own
conduct moves the needle.

> Write: The rules changed and nobody handed you the new ones. That's real. It's
> also not a reason to stop moving.
>
> Not: Modern women broke the deal.

## Motion, sound, haptics, accessibility

Bound by `DESIGN.md`. Restated because this flow is where they are most likely
to be broken:

- **Silence.** No sound plays anywhere in onboarding except `contract-signed` at
  the signature. There is no fifth sound and no question ever makes a noise.
- **Haptics.** `selectionAsync` on discrete stops, ticks, and steps;
  `impactAsync(Light)` on commit. **Never a success notification** — that
  belongs to Closeout alone, and there is no haptic for a "bad" answer.
- **Motion.** Screen transitions use `quick`; the needle spring runs only on the
  reading screen. Nothing loops, nothing pulses, nothing celebrates.
- **One brass element per screen.** Normally the commit action. If a gauge is
  brass, the button is not.
- **Reduced motion.** All drag inputs remain fully operable; only the transitions
  are removed. The needle cross-fades.
- **Targets** at least 44pt. Every drag input must also be operable by tapping a
  stop or using accessibility increment and decrement actions — a slider that
  only responds to dragging is unusable with a screen reader.
- **No icons.** Content carries none.

## Data

```ts
type Axis = 'frame' | 'desire' | 'connection' | 'appetite' | 'craft';

type Profile = { name: string; age: number; situation: 'studying' | 'working' | 'neither' };
type Answer = { id: string; axis: Axis; off: number; raw: unknown };
type Onboarding = {
  profile: Profile;
  answers: Answer[];
  honestThing: string;      // never scored
  northStar: NorthStarType;
  signedAt: number;
};
```

Persist per screen, not at the end. A man who loses twelve minutes of answers to
a phone call does not start again. Version the persisted shape now — this is
transient local state today and Convex owns it later.

## Safety — **OPEN, and a ship blocker for this flow**

The product spec lists the safety floor as unresolved. This flow is where it
bites hardest: C1 asks a lonely man to count the people who would take his call
at 2am, and a meaningful share will fill in zero.

Onboarding must not ship without a decided response to a distress signal. That
decision is the founder's, not an implementation detail, and it should cover at
minimum: which answers constitute a signal, what North does when it sees one,
and where the line sits between a coach and a clinician.

What must **not** happen by default: no crisis-hotline interstitial dropped in
by an implementer, no scoring change, and no comment on the answer. Until the
policy is decided, C1 and C2 record their answers and say nothing.

## Open

- The Bearing formula, and whether the five Axes weigh equally.
- The safety response above.
- Whether the `off` weightings need calibrating against real answers. They are
  authored judgements and should be revisited once there is data — deterministic
  and testable, but not yet validated.
- Recalibration: which subset of these twenty runs again after a long absence.
  The product spec requires a partial re-run; the subset is not chosen.
- Whether the eight types need a ninth entry for a man who recognises none.
