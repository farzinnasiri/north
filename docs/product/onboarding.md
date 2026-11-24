# Onboarding

North onboarding v0.3 — 15-question candidate instrument.

Date: 2026-09-28

Status: implemented in the app for cognitive testing; not a validated psychological instrument. Answers stay on the phone.

## The decision

North v0.3 contains exactly **15 substantive prompts** across the required onboarding:

- **12 Reality questions:** two complementary questions for each of six Axes.
- **1 final Reality reflection:** the issue the person is stepping around.
- **2 North Star questions:** priorities and a preferred ordinary life.

The following do not count as assessment questions:

- factual profile fields: name and age;
- result explanations, quotes, progress pauses, and animations;
- choosing among the final North Star candidates, because that is the outcome decision rather than another test item;

Required role-model picking is removed. If the product keeps it, it must replace one of the two North Star prompts rather than lengthening the assessment. A better use is to show figures as optional inspiration after the person chooses a North Star, with no hidden score.

## What the 15 prompts do

### Reality

Reality is a present-state behavioral calibration used to:

1. show a careful picture of recent conduct;
2. find an area that may need attention;
3. personalize the first Action;
4. establish a baseline that can be revisited later.

It is not a masculinity score, diagnosis, or stable personality type.

### North Star

North Star clarifies desired priorities and tradeoffs. It helps order possible destinations, but the person makes the final choice. There is no psychologically “healthy” pole.

## Response-scale library

Reusing a small number of scales lowers cognitive load. Controls should show the full written options; do not hide meaning behind an unlabeled slider.

### Scale A — opportunity frequency

Use when a behavior can only occur if a relevant situation happened.

1. No opportunity
2. Never
3. Rarely
4. Half the time
5. Usually
6. Always

`I didn't have a chance` is missing/contextual data, not the lowest or highest score.

### Scale B — count in a recall window

Use for memorable but not exactly recalled events.

1. 0
2. 1
3. 2–3 times
4. 4–6 times
5. 7–10 times
6. 11+

Adjust the upper bands only after pilot distributions show they are unrealistic.

### Scale C — agreement

Use only for short first-person beliefs.

1. Strongly disagree
2. Disagree
3. Somewhat disagree
4. Somewhat agree
5. Agree
6. Strongly agree

The lack of a midpoint is acceptable here because each statement is concrete enough to lean on. `Not sure` should be available separately during testing and treated as missing, not as a hidden midpoint.

### Scale D — count of people

1. 0
2. 1
3. 2
4. 3–4
5. 5+
6. Not sure

## The 15 candidate prompts

Recall periods appear above the question. Counts use numerals and short ranges; opportunity-based items keep frequency labels rather than changing to counts. Option order, scores, and North Star weights are unchanged by the copy edit.

Candidate wording is deliberately plain and mostly at a fifth-grade reading level. It is implemented so the team can run cognitive tests; shipping it does not make it a validated instrument.

---

## Reality: Frame

Working definition: **stating a view, need, or limit with respect when another person may dislike it.** Frame is not dominance, anger, bluntness, or winning an argument.

### 1. Saying what you think

**Prompt**
Recall period: **Last 30 days**.

When you disagreed, how often did you say so?

**Response**
Scale A — No opportunity; Never; Rarely; Half the time; Usually; Always.

**Why it exists**
Samples respectful self-expression under interpersonal cost.

**Scoring hypothesis**
More frequent respectful expression suggests stronger Frame. No opportunity is not scored.

### 2. A yes you regretted

**Prompt**
Recall period: **Last 30 days**.

How many times did you say yes and regret it?

**Response**
Scale B — 0; 1; 2–3; 4–6; 7–10; 11+.

**Why it exists**
Measures a concrete cost of weak boundaries without treating every act of help as a problem.

**Scoring hypothesis**
Higher frequency suggests more attention may be needed.

## Reality: Desire

Working definition: **taking reasonable steps toward something the person wants despite uncertainty or possible rejection.** Desire is not entitlement, heterosexual approach behavior, risk for its own sake, or getting every desired outcome.

### 3. Starting contact

**Prompt**
Recall period: **Last 30 days**.

When you wanted to know someone better, how often did you start the conversation?

**Response**
Scale A.

**Why it exists**
Preserves the approach-behavior insight without assuming gender, romance, relationship status, or stranger approach.

### 4. Ruling yourself out

**Prompt**
Recall period: **Last 30 days**.

How many times did you rule yourself out before even trying?

**Response**
Scale B — 0; 1; 2–3; 4–6; 7–10; 11+.

**Why it exists**
Samples self-rejection as a recent behavior, separate from starting contact.

**Scoring hypothesis**
More frequent self-rejection suggests more attention may be needed.

## Reality: Connection

Working definition: **having accessible mutual support and taking part in maintaining close relationships.** Connection is not popularity, charisma, contact count, or being the centre of a room.

### 5. The 2 a.m. call

**Prompt**
If you were in trouble at 2 a.m., how many people could you call?

**Response**
Scale D — 0; 1; 2; 3–4; 5+; Not sure.

**Why it exists**
Keeps one of North's strongest concrete images while measuring people rather than relationship categories.

### 6. Starting personal conversations

**Prompt**
Recall period: **Last 7 days**.

How many personal conversations did you start with people you know?

**Response**
0; 1; 2–3; 4–6; 7–10; 11+.

**Why it exists**
Measures active maintenance instead of waiting to be included.

**Testing concern**
Examples may be needed to separate a meaningful check-in from a routine work message.

## Reality: Self-command

Working definition: **keeping choice over attention and behavior when an easy reward or bad feeling pulls in another direction.** Self-command is about control and consequence, not whether an object is morally approved.

### 7. Using time as planned

**Prompt**
Recall period: **Last 7 days**.

On how many days did you use your free time as planned?

**Options**

1. 0
2. 1 day
3. 2–3 days
4. 4–5 days
5. 6 days
6. Every day
7. No plan

**Why it exists**
Provides a positive regulation item rather than asking only about vice and failure.

**Scoring hypothesis**
`No plan` is a planning/context state. It is not automatically the worst response.

### 8. A habit causing a real cost

**Prompt**
Recall period: **Last 30 days**.

How many times did a habit cause a problem?

Supporting text: For your sleep, time, work, study, or someone close to you.

**Response**
Scale B.

**Why it exists**
Anchors Self-command to functional consequence rather than shame.

**Testing concern**
This lists several consequences. Cognitive interviews must test whether the examples help recall or make the item too broad. If too broad, split in the pilot pool and keep the stronger version.

---

## Reality: Craft

Working definition: **building capability through self-directed practice and follow-through.** Craft is not income, job status, body appearance, or productivity at any cost.

### 9. Finishing something nobody required

**Prompt**
When did you last finish something nobody made you finish?

**Options**

1. Within 7 days
2. Within 30 days
3. Within 3 months
4. Within 1 year
5. Longer ago
6. Cannot remember
7. Nothing like that lately

**Why it exists**
Preserves one of the cleanest existing measures of self-directed completion.

**Scoring hypothesis**
The first six are ordered evidence. The final option is lack of opportunity/context and should not automatically equal failure.

### 10. Intentional body care

**Prompt**
Recall period: **Last 7 days**.

On how many days did you intentionally move or care for your body?

**Options**

1. 0
2. 1 day
3. 2 days
4. 3–4 days
5. 5–6 days
6. Every day

**Why it exists**
Keeps the body inside Craft without requiring a formal exercise plan or judging appearance, strength, disability, weight, or illness. It always provides a scored answer, even when the independent-completion question is not applicable.

**Testing concern**
“Physical care” must be tested across training, walking, mobility work, rehabilitation, sleep routines, and health limitations.

---

## Reality: Agency

Working definition: **seeing and taking a useful next step, while recognizing that luck and other people also affect outcomes.** Agency is not denying circumstance, taking reckless risks, or believing confidence slogans.

### 11. A self-chosen step

**Prompt**
Recall period: **Last 7 days**.

How often did you take a step that mattered to you without being asked?

**Options**

1. 0
2. 1
3. 2–3 times
4. 4–6 times
5. Every day
6. 2+ times a day
7. No opportunity

**Why it exists**
Preserves the strongest part of the current autonomy item while excluding trivial choices.

### 12. Influence without denying luck

**Statement**
Even when luck or others affect the result, I can usually change what happens next.

**Response**
Scale C.

**Why it exists**
Lets realistic beliefs about luck coexist with perceived control.

---

## Final Reality reflection

### 13. What is costing you now?

**Prompt**
Which one is costing you most right now?

**Options**

1. An avoided conversation
2. Something I keep putting off
3. A habit taking too much
4. An apology or repair I owe
5. My body or health
6. Avoiding money matters
7. Something else
8. Not sure yet

**Status**
Unscored.

**Why it exists**
This is the bridge from measurement to the person's first useful Action. It belongs before the Reality reveal.

**Product use**
The chosen answer should affect the first Action family. If it does not, remove the collection.

---

## North Star

These two questions do not measure health or present worth. They clarify desired priorities. They may order candidate North Stars, but the person chooses the destination.

### 14. What makes a year matter?

**Prompt**
After a good year, which two matter most?

**Options — choose exactly two**

1. Built something meaningful.
2. Stronger close relationships.
3. More control of my time.
4. Greater skill and capability.
5. More stability for me or others.
6. More everyday enjoyment.
7. Helped people or my community.

**Why it exists**
Elicits direct priorities without labeling one masculine style as superior.

**Scoring rule**
Preference signal only. No answer moves Reality or Direction closer/further by itself.

### 15. An ordinary day at age + 5

**Dynamic prompt**
Context: **In 5 years · Age {Age + 5}**.

Which ordinary day would you want?

**Options — choose up to two**

1. Building something I answer for.
2. Skilled work with respected people.
3. Independent work, my own schedule.
4. Caring for people, home, or community.
5. New projects, places, and experiences.
6. Steady work, time for life.
7. Something else.
8. Not clear yet.

**Why it exists**
Replaces three repetitive, status-biased future-self questions with one ordinary-life visualization.

**Scoring rule**
Content guides North Star ordering and future Action themes. “Cannot see it clearly” may indicate future-self clarity, but it must not be converted into a severe Agency penalty without separate validation.

## Provisional scoring model

> **Prototype compatibility:** the current UI maps these ordinal answers into an
> internal 0–100 Reality shape. Reality presents broad interpretations rather
> than exact degrees. The internal values are product indices, not validated
> psychological measurements.


### Before validation

Do not present exact Axis degrees as validated measurements.

For prototype research only:

1. Map each ordinal scored response to an internal 0–4 or 0–5 position.
2. Keep `no opportunity`, `not applicable`, `not sure`, and contextual branches missing—not good or bad.
3. Treat a one-answer Axis reading as provisional; each Axis has one question that always provides a scored answer.
4. Show item evidence and broad language, not scientific precision.
5. Keep question 13 and questions 14–15 outside Reality scoring.
6. Never average North Star preferences into a “healthy masculinity” result.

### Prototype North Star ordering

North Star preferences accumulate across eight plain priorities: building,
closeness, freedom, mastery, steadiness, enjoyment, service, and candor. Each
authored archetype has a distinct priority profile. The profiles order the
archetypes; they never diagnose the person, and the first archetype is not
selected for him.

The eight archetypes are The Patriarch, The Modern Man, The Rogue, The Laughing
Wolf, The Godfather, The Kind Father, The Freethinker, and The Playboy. They are
destinations the person can choose, not labels North assigns to him.

### Prototype initial Direction

The initial Direction is a weighted gap between the six Reality readings and
the chosen North Star. Every Axis has a baseline weight of 1, so choosing a
North Star cannot erase an inconvenient Reality reading. Each destination
increases the weight of the Axes most relevant to that life. The weighted
0–100 gap maps linearly onto the 0–180 degree compass arc.

This is transparent product math, not a validated psychometric claim. It must
still be reviewed after cognitive interviews and pilot evidence.

Possible pre-validation Axis outputs:

- Pattern looks steady
- Mixed evidence
- May need attention
- Not enough information

These labels also require user testing; they are safer hypotheses, not validated cutoffs.

### After pilot evidence

Because the Axes are likely formative action indices rather than reflective personality traits:

- justify item weights through content importance and prediction of useful Actions;
- test weight sensitivity;
- test short-term stability where behavior should be stable;
- test responsiveness after relevant behavior changes;
- test whether the result improves Action relevance and completion;
- do not optimize Cronbach alpha at the cost of construct coverage.

The development process should follow intended-use validity and content/response-process evidence described in the [AERA/APA/NCME Standards](https://www.testingstandards.net/uploads/7/6/6/4/76643089/9780935302356.pdf), [APA assessment guidelines](https://www.apa.org/about/policy/guidelines-psychological-assessment-evaluation.pdf), [COSMIN content-validity guidance](https://www.cosmin.nl/wp-content/uploads/COSMIN-methodology-for-content-validity-user-manual-v1.pdf), and the [CDC cognitive-interviewing model](https://www.cdc.gov/nchs/ccqder/question-evaluation/cognitive-interviewing.html).

## Required onboarding flow

The person answers 15 substantive prompts, with the Reality reflection and North Star choice kept in their existing places.

Before this flow, acquisition uses two short surfaces: a sparse welcome with an
immediate Sign in route, then a three-frame product preview of Reality, North
Star, and Action. The preview uses product-shaped examples rather than generic
feature claims and has one Continue action. It does not add a prompt to
the instrument.

### Arrival

1. Ask what to call the person.
2. North greets them by name with its full face visible. Two short lines introduce its role and the 15 questions; Start becomes available when they finish appearing. Reduced motion skips the wait.
3. On Start, the face moves to the corner and the age question follows.

### Reality: 12 questions

4. Questions 1–2 — Frame behaviors.
5. Continue directly into the next set; the persistent instrument marks chapter progress without adding a dedicated pause screen.
6. Questions 3–4 — Desire behaviors.
7. Continue into the next set.
8. Questions 5–6 — Connection behaviors.
9. Midpoint payoff: show factual progress, not a moral conclusion.
10. Questions 7–8 — Self-command behaviors.
11. Continue into the next set.
12. Questions 9–10 — Craft behaviors.
13. Continue into the next set.
14. Questions 11–12 — Agency behaviors.

Do not reveal Axis labels or explain what answer is preferred before the questions. Dedicated quotation screens are omitted: they add length, break answering rhythm, and risk priming the next set.

### Reality payoff

15. Question 13 — what is costing the person most.
16. Honest calibration animation: each Axis resolves separately, then the shape connects.
17. Reality explanation, evidence, and Save image. Do not open a share sheet during onboarding.
18. Explicit transition: “That is where you are. Now choose where you want to go.”

### North Star: two questions

19. Questions 14–15.
20. One truthful curation animation that says it is organizing stated preferences.
21. Present all eight candidates in ranked order, beginning **unselected**, with tradeoffs.
22. Let the person inspect all candidates and explicitly choose.

### Completion

23. Calculate Direction from both Reality and the chosen North Star; do not add a simulated loading screen.
24. Show the closing letter without unsupported social or retention claims.
25. Sign the Contract.
26. Preview the first Action with the chosen North Star and starting Axis. Question 13 selects the closest matching authored Action; the chosen North Star orders later Actions by weighting the remaining Reality gaps.
27. Offer two first Actions, then ask once for the check-in notification. There is no account.
28. Enter the Action flow.
29. Keep the Code outside the required completion path, available from You.

## Interaction rules

1. Every question starts unselected.
2. Selecting an answer never auto-advances. The person confirms with the same fixed Continue action.
3. One press can advance at most one step; input remains locked through transition completion.
4. A Back action restores the saved answer and permits correction. It remains in the fixed bottom action lane beneath Continue rather than in top chrome.
5. Show `Question n of 15`, but do not show a moral score during answering.
6. Keep the question and first options in the eye lane; long display copy does not begin at the top edge.
7. Use sentence case for questions and options; reserve condensed uppercase for short labels/actions.
8. Do not color one option as virtuous before selection.
9. Ordinal scales keep their order. Non-ordinal lists may rotate during pilot testing to detect order effects.
10. Sensitive optional branches explain why the information is asked and allow Skip without penalty.

## What is deliberately removed from the required 15

- walking up to an unknown woman;
- number of women not told feelings;
- liked versus respected as a Reality score;
- anger recency inside Frame;
- moral penalties for phone, porn, food, weed, alcohol, games, or exercise;
- paid dating/sexual/creator content;
- gambling recency;
- body appearance as proof of keeping one's word;
- confidence-is-innate versus confidence-is-earned;
- happy versus satisfied;
- three repetitive future-self screens;
- required celebrity/fictional-character scoring;
- six virtue-versus-flaw North Star binaries.

This content can only return through a justified optional branch, an unscored reflection, or a validated safety purpose.

## Cognitive interview checklist

For every candidate, ask target users:

1. What is this question asking in your own words?
2. What event or period did you think about?
3. How did you choose between the two closest answers?
4. Was an honest answer missing?
5. Which answer looked like the answer North wanted?
6. Did the item feel relevant to someone with your work, relationship, orientation, health, and culture?
7. Would you answer differently if another person could see it?

Revise the item if respondents do not retrieve the intended behavior or if the status-preferred answer dominates their reasoning. The item-generation and reduction sequence follows the development process summarized by [Boateng et al.](https://pmc.ncbi.nlm.nih.gov/articles/PMC6004510/) and the response-process method used by the [CDC](https://www.cdc.gov/nchs/ccqder/question-evaluation/cognitive-interviewing.html).

## Validation gates before external release

1. Product owner accepts the six working Axis definitions.
2. A psychometrician reviews the 15-item candidate bank for content coverage and construct contamination.
3. Cognitive interviews identify no systematic missing answers or obvious status answers.
4. The team accepts that v0.3 will not display scientifically precise degrees before validation.
5. Every collected response has a declared product use: Axis calibration, Action personalization, or North Star preference.

The prototype exists to test these gates. Do not describe its readings as validated until the remaining gates are met.
