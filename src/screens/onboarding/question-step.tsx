import { useState } from 'react';

import { ChoiceInstrument } from '@/components/ui/choice-instrument';
import { DayBar } from '@/components/ui/day-bar';
import { InstrumentSlider } from '@/components/ui/instrument-slider';
import { NorthField } from '@/components/ui/north-field';
import { RankInstrument } from '@/components/ui/rank-instrument';
import { StepperInstrument, TallyInstrument } from '@/components/ui/tally-instrument';
import { TimeSinceArc } from '@/components/ui/time-since-arc';
import type {
  Answer,
  OnboardingQuestion,
  Profile,
} from '@/domains/onboarding/onboarding';
import {
  answerFor,
  craftRankItems,
  scoreQuestion,
} from '@/domains/onboarding/onboarding';
import { OnboardingFrame } from '@/screens/onboarding/onboarding-frame';

type QuestionStepProps = {
  answer?: Answer;
  onAnswer: (answer: Answer) => void;
  profile: Profile;
  question: OnboardingQuestion;
};

function initialRaw(question: OnboardingQuestion, answer: Answer | undefined, profile: Profile): unknown {
  if (answer) return answer.raw;
  switch (question.kind) {
    case 'time-since':
    case 'two-door':
    case 'recognition':
      return null;
    case 'tally':
    case 'stepper':
    case 'day-bar':
      return 0;
    case 'spectrum':
      return 50;
    case 'roster':
      return [];
    case 'multi-select':
      return [];
    case 'duration':
      return question.mode === 'duration' ? 2 : 5;
    case 'rank':
      return craftRankItems(profile.situation);
  }
}

function formatMinutes(minutes: number): string {
  if (minutes < 60) return `${minutes} min`;
  const hours = Math.floor(minutes / 60);
  const remainder = minutes % 60;
  return remainder === 0 ? `${hours} hr` : `${hours} hr ${remainder} min`;
}

export function QuestionStep({
  answer,
  onAnswer,
  profile,
  question,
}: QuestionStepProps) {
  const [raw, setRaw] = useState<unknown>(() => initialRaw(question, answer, profile));

  function commit() {
    onAnswer(answerFor(question, raw, scoreQuestion(question, raw)));
  }

  // Single-choice questions advance on the choice itself. Asking a man to pick
  // an answer and then confirm it doubles the taps and adds a row of chrome to
  // twelve screens for no information.
  function commitWith(next: unknown) {
    setRaw(next);
    onAnswer(answerFor(question, next, scoreQuestion(question, next)));
  }

  let disabled = false;
  let auto = false;
  let instrument: React.ReactNode;

  switch (question.kind) {
    case 'time-since':
      auto = true;
      instrument = (
        <TimeSinceArc
          onChange={commitWith}
          options={question.options.map((option) => option.label)}
          value={raw as number | null}
        />
      );
      break;
    case 'two-door': {
      const state = (raw ?? { choice: null, name: '' }) as { choice: string | null; name: string };
      const needsName = question.options.some((option) => option.value === 'someone');
      // Only the door that asks for a name needs a commit step.
      auto = !needsName || state.choice !== 'someone';
      disabled = state.choice === null || (state.choice === 'someone' && state.name.trim().length === 0);
      instrument = (
        <>
          <ChoiceInstrument
            onChange={(values) => {
              const next = { ...state, choice: values[0] };
              // A door that needs a name still needs a commit; the other advances.
              if (values[0] === 'someone') setRaw(next);
              else commitWith(next);
            }}
            options={question.options.map((option) => ({ label: option.label, value: option.value }))}
            presentation="doors"
            values={state.choice ? [state.choice] : []}
          />
          {state.choice === 'someone' ? (
            <NorthField
              accessibilityLabel="First person you tell"
              autoCapitalize="words"
              multiline={false}
              onChangeText={(name) => setRaw({ ...state, name })}
              placeholder=""
              value={state.name}
            />
          ) : null}
        </>
      );
      break;
    }
    case 'tally':
      instrument = <TallyInstrument count={raw as number} onChange={setRaw} />;
      break;
    case 'spectrum':
      instrument = (
        <InstrumentSlider
          accessibilityLabel={question.prompt}
          leftLabel={question.left}
          maximum={100}
          onChange={setRaw}
          rightLabel={question.right}
          value={raw as number}
        />
      );
      break;
    case 'recognition':
      auto = true;
      instrument = (
        <ChoiceInstrument
          onChange={(values) => commitWith(Number(values[0]))}
          options={question.options.map((option, optionIndex) => ({
            label: option.label,
            value: `${optionIndex}`,
          }))}
          values={raw === null ? [] : [`${raw}`]}
        />
      );
      break;
    case 'roster': {
      const picked = raw as string[];
      disabled = picked.length === 0;
      instrument = (
        <ChoiceInstrument
          multiple
          onChange={(values) => {
            // "Honestly, nobody" cannot coexist with a name.
            const addedExclusive =
              values.includes(question.exclusive) && !picked.includes(question.exclusive);
            setRaw(
              addedExclusive
                ? [question.exclusive]
                : values.filter((value) => value !== question.exclusive),
            );
          }}
          options={question.options.map((option) => ({
            label: option.label,
            value: option.value,
          }))}
          values={picked}
        />
      );
      break;
    }
    case 'stepper':
      instrument = <StepperInstrument count={raw as number} onChange={setRaw} />;
      break;
    case 'day-bar':
      instrument = <DayBar onChange={setRaw} value={raw as number} />;
      break;
    case 'multi-select': {
      const values = raw as string[];
      disabled = values.length === 0;
      instrument = (
        <ChoiceInstrument
          multiple
          onChange={setRaw}
          options={question.options.map((option) => ({ label: option.label, value: option.value }))}
          presentation="chips"
          values={values}
        />
      );
      break;
    }
    case 'duration': {
      const value = raw as number;
      instrument = question.mode === 'duration' ? (
        <InstrumentSlider
          accessibilityLabel="Time before you would notice"
          leftLabel="An hour"
          maximum={4}
          onChange={setRaw}
          readout={question.labels[value]}
          rightLabel="Longer"
          value={value}
        />
      ) : (
        <InstrumentSlider
          accessibilityLabel="How long five minutes became"
          leftLabel="Five minutes"
          maximum={300}
          minimum={5}
          onChange={setRaw}
          readout={formatMinutes(value)}
          rightLabel="Five hours"
          value={value}
        />
      );
      break;
    }
    case 'rank':
      instrument = <RankInstrument items={raw as string[]} onChange={setRaw} />;
      break;
  }

  return (
    <OnboardingFrame
      actionLabel={auto ? undefined : 'Mark it'}
      disabled={disabled}
      onContinue={auto ? undefined : commit}
      title={question.prompt}
    >
      {instrument}
    </OnboardingFrame>
  );
}
