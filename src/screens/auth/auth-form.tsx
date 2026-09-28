import { Link, useRouter } from 'expo-router';
import { useRef, useState } from 'react';
import type { TextInput } from 'react-native';
import { StyleSheet, View } from 'react-native';

import { NorthAuthField } from '@/components/ui/north-auth-field';
import { NorthButton } from '@/components/ui/north-button';
import { NorthMark } from '@/components/ui/north-mark';
import { NorthScreen } from '@/components/ui/north-screen';
import { NorthText } from '@/components/ui/north-text';
import { useAccount } from '@/domains/account/store';
import { useJourney } from '@/domains/journey/store';
import type { AuthErrors, AuthMode } from '@/screens/auth/validation';
import { validateAuth } from '@/screens/auth/validation';
import { colors, spacing, typography } from '@/theme';

type AuthFormProps = {
  mode: AuthMode;
};

const CONTENT = {
  'sign-in': {
    body: 'Continue where you left off.',
    submit: 'Sign in',
    switchHref: '/onboarding' as const,
    switchLabel: 'Start onboarding',
    switchPrompt: 'New to North?',
    title: 'Welcome back.',
  },
  'sign-up': {
    body: 'Save your progress before the first Action.',
    submit: 'Create account',
    switchHref: '/sign-in' as const,
    switchLabel: 'Sign in',
    switchPrompt: 'Already have an account?',
    title: 'Create your account.',
  },
} as const;

export function AuthForm({ mode }: AuthFormProps) {
  const copy = CONTENT[mode];
  const passwordRef = useRef<TextInput>(null);
  const router = useRouter();
  const journey = useJourney((state) => state.journey);
  const createAccount = useAccount((state) => state.createAccount);
  const signIn = useAccount((state) => state.signIn);
  const [email, setEmail] = useState('');
  const [errors, setErrors] = useState<AuthErrors>({});
  const [password, setPassword] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false);

  function submit() {
    const nextErrors = validateAuth(mode, { email, password });
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    // Clerk will create or activate the durable session here. The prototype
    // only keeps enough local state to make the authored flow explorable.
    if (mode === 'sign-up') {
      createAccount(email, journey?.name ?? '');
      router.replace('/personalize');
      return;
    }

    signIn(email, journey?.name ?? '');
    router.replace(journey ? '/' : '/onboarding');
  }

  return (
    <NorthScreen
      automaticallyAdjustKeyboardInsets
      contentInsetAdjustmentBehavior="always"
      contentStyle={styles.screen}
    >
      <View style={styles.header}>
        <Link asChild href="/welcome" replace>
          <NorthButton label="Back" style={styles.back} tone="quiet" />
        </Link>
        <NorthMark size={44} />
      </View>

      <View style={styles.copy}>
        <NorthText variant="title">{copy.title}</NorthText>
        <NorthText>{copy.body}</NorthText>
      </View>

      <View style={styles.form}>
        <NorthAuthField
          autoCapitalize="none"
          autoComplete="email"
          error={errors.email}
          inputMode="email"
          keyboardType="email-address"
          label="Email"
          onChangeText={(value) => {
            setEmail(value);
            if (errors.email) setErrors((current) => ({ ...current, email: undefined }));
          }}
          onSubmitEditing={() => passwordRef.current?.focus()}
          placeholder="you@example.com"
          returnKeyType="next"
          textContentType="emailAddress"
          value={email}
        />
        <NorthAuthField
          autoComplete={mode === 'sign-up' ? 'new-password' : 'current-password'}
          error={errors.password}
          label="Password"
          onChangeText={(value) => {
            setPassword(value);
            if (errors.password) setErrors((current) => ({ ...current, password: undefined }));
          }}
          onSubmitEditing={submit}
          onToggleSecure={() => setPasswordVisible((visible) => !visible)}
          placeholder={mode === 'sign-up' ? 'At least 8 characters' : 'Your password'}
          ref={passwordRef}
          returnKeyType="go"
          secureTextEntry={!passwordVisible}
          secureVisible={passwordVisible}
          textContentType={mode === 'sign-up' ? 'newPassword' : 'password'}
          value={password}
        />
      </View>

      <View style={styles.actions}>
        <NorthButton label={copy.submit} onPress={submit} />
        <View style={styles.switchRow}>
          <NorthText variant="small">{copy.switchPrompt}</NorthText>
          <Link href={copy.switchHref} replace style={styles.switchLink}>
            {copy.switchLabel}
          </Link>
        </View>
      </View>
    </NorthScreen>
  );
}

const styles = StyleSheet.create({
  actions: {
    gap: spacing.lg,
    marginTop: 'auto',
    paddingTop: spacing.xxl,
  },
  back: {
    minHeight: 44,
    paddingHorizontal: 0,
    width: 72,
  },
  copy: {
    gap: spacing.md,
  },
  form: {
    gap: spacing.xl,
  },
  header: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  screen: {
    flexGrow: 1,
    gap: spacing.xxl,
    minHeight: '100%',
  },
  switchLink: {
    color: colors.brass,
    fontFamily: typography.sansMedium,
    fontSize: 14,
    lineHeight: 21,
  },
  switchRow: {
    alignItems: 'center',
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    justifyContent: 'center',
  },
});
