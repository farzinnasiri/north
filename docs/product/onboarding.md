# Onboarding

North onboarding v0.2 — 30-question candidate instrument.

Date: 2026-08-28

Status: implemented in the frontend prototype for cognitive testing; not a validated psychological instrument.

## The decision

North v0.2 contains exactly **30 substantive prompts** across the required onboarding:

- **24 Reality questions:** four candidates for each of six Axes.
- **1 final Reality reflection:** the issue the person is stepping around.
- **5 North Star questions:** values and desired-life tradeoffs.

The following do not count as assessment questions:

- factual profile fields: name and age;
- result explanations, quotes, progress pauses, and animations;
- choosing among the final North Star candidates, because that is the outcome decision rather than another test item;

Required role-model picking is removed. If the product keeps it, it must replace one of the five North Star prompts rather than becoming question 31. A better use is to show figures as optional inspiration after the person chooses a North Star, with no hidden score.

## What the 30 prompts do

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

1. I didn't have a chance
2. Never
3. Rarely
4. About half the time
5. Most of the time
6. Every time

`I didn't have a chance` is missing/contextual data, not the lowest or highest score.

### Scale B — count in a recall window

Use for memorable but not exactly recalled events.

1. None
2. Once
3. 2–3 times
4. 4–6 times
5. 7–10 times
6. 11 or more

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

1. None
2. One
3. Two
4. 3–4
5. 5 or more
6. Not sure

### Scale E — balanced tradeoff

1. A, much more
2. A, a little more
3. They matter about the same
4. B, a little more
5. B, much more

A midpoint belongs here because equal priority can be a genuine value.

## The 30 candidate prompts

Candidate wording is deliberately plain and mostly at a fifth-grade reading level. It is implemented so the team can run cognitive tests; shipping it does not make it a validated instrument.

---

## Reality: Frame

Working definition: **stating a view, need, or limit with respect when another person may dislike it.** Frame is not dominance, anger, bluntness, or winning an argument.

### 1. Saying what you think

**Prompt**
In the past 30 days, when you thought someone was wrong, how often did you tell them you disagreed?

**Response**
Scale A — I didn't have a chance; Never; Rarely; About half the time; Most of the time; Every time.

**Why it exists**
Samples respectful self-expression under interpersonal cost.

**Scoring hypothesis**
More frequent respectful expression suggests stronger Frame. No opportunity is not scored.

### 2. A request that was too much

**Prompt**
The last time someone asked for more than you could give, what did you do?

**Options**

1. I said no.
2. I offered less than they asked for.
3. I asked for time to decide.
4. I said yes and was okay with it.
5. I said yes and wished I hadn't.
6. No one has asked me lately.

**Why it exists**
Separates a deliberate no, a negotiated limit, chosen generosity, and regretful compliance.

**Scoring hypothesis**
Option 5 is the clearest needs-attention response. Options 1–4 are different valid choices and should not be forced onto one simple good/bad line. Option 6 is not scored.

### 3. A yes you regretted

**Prompt**
In the past 30 days, how many times did you say yes and later wish you had said no?

**Response**
Scale B — None through 11 or more.

**Why it exists**
Measures a concrete cost of weak boundaries without treating every act of help as a problem.

**Scoring hypothesis**
Higher frequency suggests more attention may be needed.

### 4. Changing a choice to avoid upset

**Prompt**
In the past 30 days, how many times did you go along with someone else so they would not be upset with you?

**Response**
Scale B — None through 11 or more.

**Why it exists**
Samples approval-driven reversal rather than a general preference for peace.

**Testing concern**
Cognitive interviews must determine whether people include healthy compromise. If they do, revise to anchor regret or continued disagreement.

---

## Reality: Desire

Working definition: **taking reasonable steps toward something the person wants despite uncertainty or possible rejection.** Desire is not entitlement, heterosexual approach behavior, risk for its own sake, or getting every desired outcome.

### 5. Starting contact

**Prompt**
In the past 30 days, when you wanted to know someone better, how often did you start the conversation?

**Response**
Scale A.

**Why it exists**
Preserves the approach-behavior insight without assuming gender, romance, relationship status, or stranger approach.

### 6. Making a reasonable ask

**Prompt**
In the past 30 days, how often did you ask for something they might say no to?

**Response**
Scale A.

**Why it exists**
Measures approach in work, study, friendship, dating, and ordinary life.

**Testing concern**
Probe what users count as “reasonable” and whether the phrase changes their answer.

### 7. Ruling yourself out

**Statement**
I decide I can't do it before I try.

**Response**
Scale C — Strongly disagree through Strongly agree.

**Why it exists**
Samples automatic self-rejection in direct first-person language.

**Scoring hypothesis**
Agreement suggests more attention may be needed. It should never outweigh actual behavior by itself.

### 8. Fear stopping a wanted step

**Prompt**
In the past 30 days, how many times did being afraid they would say no stop you from doing something you still wanted to do?

**Options**

1. None
2. Once
3. 2–3 times
4. 4–6 times
5. 7 or more
6. Nothing like that came up

**Why it exists**
Distinguishes fear-driven inhibition from freely choosing not to act.

**Scoring hypothesis**
Frequency is scored; no opportunity is not.

---

## Reality: Connection

Working definition: **having accessible mutual support and taking part in maintaining close relationships.** Connection is not popularity, charisma, contact count, or being the centre of a room.

### 9. The 2 a.m. call

**Prompt**
If you were in trouble at 2 a.m., how many people could you call?

**Response**
Scale D — None; One; Two; 3–4; 5 or more; Not sure.

**Why it exists**
Keeps one of North's strongest concrete images while measuring people rather than relationship categories.

### 10. Someone waiting for the real answer

**Prompt**
In the past 30 days, how many times did someone close to you ask how you were and keep listening after your first answer?

**Response**
Scale B.

**Why it exists**
Samples received emotional support in memorable, human language.

### 11. Starting personal conversations

**Prompt**
In the past 7 days, how many personal conversations did you start with someone you know?

**Response**
None; One; 2–3; 4–6; 7–10; 11 or more.

**Why it exists**
Measures active maintenance instead of waiting to be included.

**Testing concern**
Examples may be needed to separate a meaningful check-in from a routine work message.

### 12. Giving the real listen

**Prompt**
In the past 30 days, how many times did you ask someone how they were and keep listening after their first answer?

**Response**
Scale B.

**Why it exists**
Balances received connection with given connection. The Axis should not only ask what other people do for the user.

---

## Reality: Self-command

Working definition: **keeping choice over attention and behavior when an easy reward or bad feeling pulls in another direction.** Self-command is about control and consequence, not whether an object is morally approved.

### 13. Using time as planned

**Prompt**
In the past 7 days, on how many days did you spend your free time the way you planned?

**Options**

1. None
2. One day
3. 2–3 days
4. 4–5 days
5. 6 days
6. Every day
7. I did not make a plan

**Why it exists**
Provides a positive regulation item rather than asking only about vice and failure.

**Scoring hypothesis**
`I did not make a plan` is a planning/context state. It is not automatically the worst response.

### 14. Five more minutes

**Prompt**
Think of the last time you opened TikTok, Instagram, X, YouTube, or a similar app and told yourself "five more minutes." How long did you stay?

**Options**

1. Under 10 minutes
2. 10–29 minutes
3. 30–59 minutes
4. 1–2 hours
5. More than 2 hours
6. This has not happened lately
7. I do not use these apps

**Why it exists**
Preserves one of the most recognizable and useful North questions: the gap between an intended limit and what happened.

**Scoring hypothesis**
Only options 1–5 form a severity order. Options 6–7 are contextual branches.

### 15. Coping that ran long

**Prompt**
In the past 30 days, how many times did you handle a bad day in a way that took more time or energy than you meant?

**Response**
Scale B.

**Why it exists**
Measures impaired control without assigning moral points to phone, food, porn, alcohol, games, work, or exercise.

**Optional unscored follow-up**
What did you reach for? This can personalize Actions but must not add a penalty by category.

### 16. A habit causing a real cost

**Prompt**
In the past 30 days, how many times did a habit cause a problem for your sleep, time, work, study, or someone close to you?

**Response**
Scale B.

**Why it exists**
Anchors Self-command to functional consequence rather than shame.

**Testing concern**
This lists several consequences. Cognitive interviews must test whether the examples help recall or make the item too broad. If too broad, split in the pilot pool and keep the stronger version.

---

## Reality: Craft

Working definition: **building capability through self-directed practice and follow-through.** Craft is not income, job status, body appearance, or productivity at any cost.

### 17. Skills used for another person

**Prompt**
In the past year, how many skills did you use to make, fix, teach, or solve something for someone else?

**Options**

1. None
2. One
3. Two
4. 3–4
5. 5 or more
6. Not sure

**Why it exists**
Keeps the demonstrated-skill idea while including unpaid, early-career, student, care, and practical capability.

### 18. Finishing something nobody required

**Prompt**
When did you last finish something nobody made you finish?

**Options**

1. In the past 7 days
2. In the past 30 days
3. In the past 3 months
4. In the past year
5. Longer ago
6. I cannot remember
7. I have not had something like that lately

**Why it exists**
Preserves one of the cleanest existing measures of self-directed completion.

**Scoring hypothesis**
The first six are ordered evidence. The final option is lack of opportunity/context and should not automatically equal failure.

### 19. Deliberate practice

**Prompt**
In the past 7 days, on how many days did you practice a skill you want to improve?

**Options**

1. None
2. One day
3. 2 days
4. 3–4 days
5. 5–6 days
6. Every day
7. I am not trying to improve a skill right now

**Why it exists**
Measures investment in capability rather than current status.

### 20. Following through on body care

**Prompt**
In the past 7 days, on how many days did you exercise or take care of your body as planned?

**Options**

1. None
2. One day
3. 2 days
4. 3–4 days
5. 5–6 days
6. Every day
7. I did not make a plan

**Why it exists**
Keeps the body inside Craft without judging appearance, strength, disability, weight, or illness.

**Testing concern**
“Physical care” must be tested across training, walking, mobility work, rehabilitation, sleep routines, and health limitations.

---

## Reality: Agency

Working definition: **seeing and taking a useful next step, while recognizing that luck and other people also affect outcomes.** Agency is not denying circumstance, taking reckless risks, or believing confidence slogans.

### 21. A self-chosen step

**Prompt**
In the past 7 days, how many times did you take a step that mattered to you without anyone asking?

**Options**

1. None
2. Once
3. 2–3 times
4. 4–6 times
5. Every day
6. More than once a day
7. Nothing like that came up

**Why it exists**
Preserves the strongest part of the current autonomy item while excluding trivial choices.

### 22. Finding a first step

**Statement**
When I do not know how to do something, I can usually find a first step.

**Response**
Scale C.

**Why it exists**
Measures practical self-efficacy instead of asking whether confidence is innate or earned.

### 23. What happened after a setback

**Prompt**
Think of the last plan that went wrong. What did you do next?

**Options**

1. I tried another way right away.
2. I asked for help and kept going.
3. I took a break and came back.
4. I stopped because the plan did not make sense anymore.
5. I gave up even though I still wanted it.
6. No plan has gone wrong lately.

**Why it exists**
Separates adaptation, help-seeking, recovery, sensible stopping, and helpless withdrawal.

**Scoring hypothesis**
Options 1–4 are different forms of agency. Option 5 is the clearest needs-attention response. Option 6 is not scored.

### 24. Influence without denying luck

**Statement**
Even when luck or other people shape the result, I can usually change what happens next.

**Response**
Scale C.

**Why it exists**
Lets realistic beliefs about luck coexist with perceived control.

---

## Final Reality reflection

### 25. What is costing you now?

**Prompt**
Which one is costing you most right now?

**Options**

1. A conversation I keep avoiding
2. Something I keep saying I will start
3. A habit that keeps taking more than I mean to give
4. An apology or repair I owe
5. Taking care of my body or health
6. Money I keep avoiding
7. Something else
8. I am not sure yet

**Status**
Unscored.

**Why it exists**
This is the bridge from measurement to the person's first useful Action. It belongs before the Reality reveal.

**Product use**
The chosen answer should affect the first Action family. If it does not, remove the collection.

---

## North Star

These five questions do not measure health or present worth. They clarify desired priorities. They may order candidate North Stars, but the person chooses the destination.

### 26. What makes a year matter?

**Prompt**
At the end of a good year, which two would matter most to you?

**Options — choose exactly two**

1. I built or improved something that matters.
2. My closest relationships became stronger.
3. I had more freedom over my time.
4. I became more skilled and capable.
5. I made life steadier for myself or other people.
6. I enjoyed more of my ordinary days.
7. I helped people or a community I care about.

**Why it exists**
Elicits direct priorities without labeling one masculine style as superior.

**Scoring rule**
Preference signal only. No answer moves Reality or Direction closer/further by itself.

### 27. Building versus protecting time

**Prompt**
If you had to give something up, which way would you go?

**A**
Protect more of my time, even if I build less.

**B**
Build more, even if it takes more of my time.

**Response**
Scale E — A, much more; A, a little more; They matter about the same; B, a little more; B, much more.

**Why it exists**
Both answers carry a real cost. This is a tradeoff rather than ambition versus failure.

### 28. Commitment versus flexibility

**Prompt**
I want more room in my life for…

**A**
A close life with another person, even if I have less freedom.

**B**
More freedom, even if I share my life less.

**Response**
Scale E.

**Why it exists**
Clarifies relationship centrality without calling commitment responsible and freedom selfish, or vice versa.

**Branching note**
People who do not want a romantic partnership can still interpret A as a deeply shared life. Test that interpretation; revise if it remains romance-bound.

### 29. Friction versus leaving something unsaid

**Prompt**
If you had to give something up, which way would you go?

**A**
Say what matters, even if the other person may not like it.

**B**
Keep the peace, even if I do not say what matters.

**Response**
Scale E.

**Why it exists**
Uses matched negative consequences so neither pole is presented as painless virtue.

**Testing concern**
This must not become a second Frame score. It is only a preferred cost in the desired life.

### 30. An ordinary day at age + 5

**Dynamic prompt**
`{Name}`, it is five years from now. You are `{Age + 5}`. Which ordinary day feels closest to the life you want?

**Options — choose up to two**

1. I lead or build something, and I own how it turns out.
2. I do skilled work with people I respect.
3. I work on my own and control more of my time.
4. I care for people, a home, or a community.
5. I move between projects, places, or new experiences.
6. I have steady work and plenty of life outside it.
7. Something else fits me better.
8. I cannot see it clearly yet.

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
3. Require at least three answered items before showing an Axis interpretation.
4. Show item evidence and broad language, not scientific precision.
5. Keep question 25 and questions 26–30 outside Reality scoring.
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

The user answers exactly 30 substantive prompts, but the experience does not become 30 identical cards.

Before this flow, acquisition uses two short surfaces: a sparse welcome with an
immediate Sign in route, then a three-frame product preview of Reality, North
Star, and Action. The preview uses product-shaped examples rather than generic
feature claims and has one Continue action. It does not add a prompt to
the instrument.

### Arrival

1. Welcome and value promise.
2. Explain privacy and honesty: no answer makes someone a better or worse man.
3. Name and age as a compact factual setup.

### Reality: 24 questions

4. Questions 1–4 — Frame behaviors.
5. Continue directly into the next set; the persistent instrument marks chapter progress without adding a dedicated pause screen.
6. Questions 5–8 — Desire behaviors.
7. Continue into the next set.
8. Questions 9–12 — Connection behaviors.
9. Midpoint payoff: show factual progress, not a moral conclusion.
10. Questions 13–16 — Self-command behaviors.
11. Continue into the next set.
12. Questions 17–20 — Craft behaviors.
13. Continue into the next set.
14. Questions 21–24 — Agency behaviors.

Do not reveal Axis labels or explain what answer is preferred before the questions. Dedicated quotation screens are omitted: they add length, break answering rhythm, and risk priming the next set.

### Reality payoff

15. Question 25 — what is costing the person most.
16. Honest calibration animation: each Axis resolves separately, then the shape connects.
17. Reality explanation, evidence, and Save image. Do not open a share sheet during onboarding.
18. Explicit transition: “That is where you are. Now choose where you want to go.”

### North Star: five questions

19. Questions 26–30.
20. One truthful curation animation that says it is organizing stated preferences.
21. Present all eight candidates in ranked order, beginning **unselected**, with tradeoffs.
22. Let the person inspect all candidates and explicitly choose.

### Completion

23. Calculate Direction from both Reality and the chosen North Star; do not add a simulated loading screen.
24. Show the closing letter without unsupported social or retention claims.
25. Sign the Contract.
26. Preview the first Action with the chosen North Star and starting Axis. Question 25 selects the closest matching authored Action; the chosen North Star orders later Actions by weighting the remaining Reality gaps.
27. Create the account, then offer Profile color once after first sign-up. Never interrupt sign-in with color selection.
28. Enter the Action flow.
29. Keep the Code outside the required completion path, available from You.

## Interaction rules

1. Every question starts unselected.
2. Selecting an answer never auto-advances. The person confirms with the same fixed Continue action.
3. One press can advance at most one step; input remains locked through transition completion.
4. A Back action restores the saved answer and permits correction. It remains in the fixed bottom action lane beneath Continue rather than in top chrome.
5. Show `Question n of 30`, but do not show a moral score during answering.
6. Keep the question and first options in the eye lane; long display copy does not begin at the top edge.
7. Use sentence case for questions and options; reserve condensed uppercase for short labels/actions.
8. Do not color one option as virtuous before selection.
9. Ordinal scales keep their order. Non-ordinal lists may rotate during pilot testing to detect order effects.
10. Sensitive optional branches explain why the information is asked and allow Skip without penalty.

## What is deliberately removed from the required 30

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
2. A psychometrician reviews the 30-item candidate bank for content coverage and construct contamination.
3. Cognitive interviews identify no systematic missing answers or obvious status answers.
4. The team accepts that v0.2 will not display scientifically precise degrees before validation.
5. Every collected response has a declared product use: Axis calibration, Action personalization, or North Star preference.

The prototype exists to test these gates. Do not describe its readings as validated until the remaining gates are met.
