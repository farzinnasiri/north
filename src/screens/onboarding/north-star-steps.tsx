import { useEffect } from 'react';
import { useReducedMotion } from 'react-native-reanimated';

import { ChoiceInstrument } from '@/components/ui/choice-instrument';
import type { NorthStarType } from '@/domains/onboarding/onboarding';
import { ROLE_MODELS, ROLE_MODEL_PICKS, STAR_QUESTIONS } from '@/domains/onboarding/north-star';
import { NorthField } from '@/components/ui/north-field';
import { OnboardingFrame } from '@/screens/onboarding/onboarding-frame';
import { NorthStarCarousel } from '@/screens/onboarding/north-star-carousel';

type RoleModelStepProps = {
  onChange: (ids: string[]) => void;
  onContinue: () => void;
  value: readonly string[];
};

/**
 * Names, not archetypes. A man knows instantly whether he would rather be
 * Spider-Man or Tony Stark; asked instead whether he is "disagreeable", he will
 * pick whichever word flatters him. The picks are weighted evidence toward the
 * destination, never the destination itself.
 */
export function RoleModelStep({
  onChange,
  onContinue,
  value,
}: RoleModelStepProps) {
  const remaining = ROLE_MODEL_PICKS - value.length;

  return (
    <OnboardingFrame
      actionLabel="Continue"
      body={
        remaining > 0
          ? `Pick ${ROLE_MODEL_PICKS}. ${remaining} left.`
          : 'That is your three. Change any, or keep going.'
      }
      disabled={value.length !== ROLE_MODEL_PICKS}
      onContinue={onContinue}
      scrollable
      title="Whose life would you try for a week?"
    >
      <ChoiceInstrument
        multiple
        onChange={(ids) => onChange(ids.slice(-ROLE_MODEL_PICKS))}
        options={ROLE_MODELS.map((model) => ({ label: model.name, value: model.id }))}
        presentation="chips"
        values={value}
      />
    </OnboardingFrame>
  );
}

type StarQuestionStepProps = {
  id: string;
  onAnswer: (id: string, answer: 'negative' | 'positive') => void;
  value?: 'negative' | 'positive';
};

export function StarQuestionStep({
  id,
  onAnswer,
  value,
}: StarQuestionStepProps) {
  const question = STAR_QUESTIONS.find((candidate) => candidate.id === id)!;

  return (
    <OnboardingFrame title={question.prompt}>
      <ChoiceInstrument
        onChange={(values) => onAnswer(id, values[0] as 'negative' | 'positive')}
        options={[
          { label: question.positive, value: 'positive' },
          { label: question.negative, value: 'negative' },
        ]}
        presentation="doors"
        values={value ? [value] : []}
      />
    </OnboardingFrame>
  );
}

type StarRevealStepProps = {
  name: string;
  onChoose: (star: NorthStarType) => void;
  onContinue: () => void;
  ranked: readonly NorthStarType[];
  value: NorthStarType | null;
};

/**
 * Every destination remains available. Ranking changes the initial order and
 * centre card; it never removes choice or labels the person he is today.
 */
export function StarRevealStep({
  name,
  onChoose,
  onContinue,
  ranked,
  value,
}: StarRevealStepProps) {
  const chosen = value ?? ranked[0];

  return (
    <OnboardingFrame
      actionLabel="This is my North Star"
      body="The closest match is first. The choice is yours."
      kicker="YOUR ALTER EGO"
      onContinue={onContinue}
      title={`Hey, ${name}. I think this is your direction.`}
    >
      <NorthStarCarousel onChoose={onChoose} ranked={ranked} value={chosen} />
    </OnboardingFrame>
  );
}

type AlterEgoIntroStepProps = {
  onContinue: () => void;
};

type AlterEgoLoadingStepProps = AlterEgoIntroStepProps & {
  duration: number;
};

export function AlterEgoLoadingStep({ duration, onContinue }: AlterEgoLoadingStepProps) {
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    const timeout = setTimeout(onContinue, reduceMotion ? 0 : duration);
    return () => clearTimeout(timeout);
  }, [duration, onContinue, reduceMotion]);

  return (
    <OnboardingFrame
      align="centre"
      body="Considering what you value, the lives you chose, and the man you can already picture."
      kicker="PROFILE COMPLETE"
      presentation="statement"
      title="Finding your direction."
    />
  );
}

export function AlterEgoIntroStep({ onContinue }: AlterEgoIntroStepProps) {
  return (
    <OnboardingFrame
      actionLabel="Show me"
      body="It is a name and image for the version of you you are choosing on purpose. When you drift, it gives you a direction to return to."
      kicker="YOUR NORTH STAR"
      onContinue={onContinue}
      presentation="statement"
      title="Now, your alter ego."
    />
  );
}

type AlterEgoStepProps = {
  name: string;
  onChange: (alterEgo: string) => void;
  onContinue: () => void;
  value: string;
};

/**
 * The destination is not only a type, it is a person — and a man is far more
 * likely to act as someone when that someone has a name he chose. This is the
 * one free-text field left in onboarding, and it is deliberate: a name cannot
 * be picked from a list without becoming somebody else's idea. It is optional
 * and skippable, so nobody is blocked by a blank box at the end.
 */
export function AlterEgoStep({
  name,
  onChange,
  onContinue,
  value,
}: AlterEgoStepProps) {
  return (
    <OnboardingFrame
      actionLabel={value.trim().length > 0 ? `Then it is ${value.trim()}` : 'Skip'}
      kicker="YOUR ALTER EGO"
      onContinue={onContinue}
      title={`What do you want to name him, ${name}?`}
    >
      <NorthField
        accessibilityLabel="A name for the man you are walking toward, optional"
        autoCapitalize="words"
        multiline={false}
        onChangeText={onChange}
        placeholder=""
        returnKeyType="done"
        value={value}
      />
    </OnboardingFrame>
  );
}
