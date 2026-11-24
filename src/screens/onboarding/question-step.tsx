import { useState } from 'react';

import { ChoiceInstrument } from '@/components/ui/choice-instrument';
import type { Answer, OnboardingQuestion, Profile } from '@/domains/onboarding/onboarding';
import { answerFor, scoreQuestion } from '@/domains/onboarding/onboarding';
import { OnboardingFrame } from '@/screens/onboarding/onboarding-frame';

type QuestionStepProps = {
  answer?: Answer;
  onAnswer: (answer: Answer) => void;
  profile: Profile;
  question: OnboardingQuestion;
};

/**
 * Every Reality item uses the same answer-then-confirm interaction. A choice
 * changes local state only; Continue is the sole navigation event.
 */
export function QuestionStep({
  answer,
  onAnswer,
  question,
}: QuestionStepProps) {
  const [raw, setRaw] = useState<number | null>(
    typeof answer?.raw === 'number' ? answer.raw : null,
  );

  return (
    <OnboardingFrame
      actionLabel="Continue"
      body={question.body}
      kicker={question.period}
      disabled={raw === null}
      emphasis={question.emphasis}
      onContinue={() => {
        if (raw === null) return;
        onAnswer(answerFor(question, raw, scoreQuestion(question, raw)));
      }}
      title={question.prompt}
    >
      <ChoiceInstrument
        onChange={(values) => setRaw(Number(values[0]))}
        options={question.options.map((option, index) => ({
          label: option.label,
          value: `${index}`,
        }))}
        values={raw === null ? [] : [`${raw}`]}
      />
    </OnboardingFrame>
  );
}
