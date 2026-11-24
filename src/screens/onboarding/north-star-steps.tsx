import { useState } from 'react';

import { ChoiceInstrument } from '@/components/ui/choice-instrument';
import type { NorthStarType, Profile } from '@/domains/onboarding/onboarding';
import { STAR_QUESTIONS } from '@/domains/onboarding/north-star';
import { OnboardingFrame } from '@/screens/onboarding/onboarding-frame';
import { NorthStarCarousel } from '@/screens/onboarding/north-star-carousel';

type StarQuestionStepProps = {
  id: string;
  onChange: (id: string, answers: string[]) => void;
  onContinue: () => void;
  profile: Profile;
  value: readonly string[];
};

function personalizedPrompt(prompt: string, profile: Profile): string {
  return prompt
    .replace('{name}', profile.name)
    .replace('{age}', String(profile.age + 5));
}

export function StarQuestionStep({
  id,
  onChange,
  onContinue,
  profile,
  value,
}: StarQuestionStepProps) {
  const question = STAR_QUESTIONS.find((candidate) => candidate.id === id)!;
  const multiple = question.max > 1;

  return (
    <OnboardingFrame
      actionLabel="Continue"
      body={question.body ?? (multiple ? `Choose ${question.min === question.max ? question.min : `up to ${question.max}`}.` : undefined)}
      disabled={value.length < question.min || value.length > question.max}
      emphasis={question.emphasis}
      kicker={question.context ? personalizedPrompt(question.context, profile) : undefined}
      onContinue={onContinue}
      title={personalizedPrompt(question.prompt, profile)}
    >
      <ChoiceInstrument
        multiple={multiple}
        onChange={(values) => onChange(id, values.slice(-question.max))}
        options={question.options.map((option) => ({
          label: option.label,
          value: option.value,
        }))}
        values={[...value]}
      />
    </OnboardingFrame>
  );
}

type StarRevealStepProps = {
  name: string;
  onChoose: (star: NorthStarType | null) => void;
  onContinue: () => void;
  ranked: readonly NorthStarType[];
  value: NorthStarType | null;
};

/**
 * Browsing changes only the card in view. The destination is not stored until
 * the person confirms the fixed action.
 */
export function StarRevealStep({
  name,
  onChoose,
  onContinue,
  ranked,
  value,
}: StarRevealStepProps) {
  const [viewed, setViewed] = useState<NorthStarType>(value ?? ranked[0]);

  return (
    <OnboardingFrame
      actionLabel="Choose this life"
      body="Swipe to explore."
      layout="stacked"
      onContinue={() => {
        onChoose(viewed);
        onContinue();
      }}
      title={`${name}, which life do you want?`}
    >
      <NorthStarCarousel
        onView={setViewed}
        ranked={ranked}
        value={viewed}
      />
    </OnboardingFrame>
  );
}
