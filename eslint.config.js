const { defineConfig } = require('eslint/config');
const expoConfig = require('eslint-config-expo/flat');
const jestPlugin = require('eslint-plugin-jest');

// Mechanized standards. The reasoning behind every ban is in
// docs/architecture/frontend-stack.md — read it before adding an exception.
const BANNED_PACKAGES = [
  { name: 'expo-av', message: 'Deprecated. Use expo-audio or expo-video.' },
  {
    name: '@react-native-async-storage/async-storage',
    message: 'Removed from React Native core. Use the expo-sqlite localStorage polyfill.',
  },
  {
    name: '@shopify/react-native-skia',
    message: 'Rejected: 3-5MB of native binaries. Use react-native-svg.',
  },
  { name: 'nativewind', message: 'Rejected. Styling is StyleSheet with tokens from @/theme.' },
  {
    name: 'react-native-unistyles',
    message: 'Rejected. Styling is StyleSheet with tokens from @/theme.',
  },
  { name: 'tamagui', message: 'Rejected. DESIGN.md is the design system.' },
  { name: 'moti', message: 'Rejected. Use the Reanimated 4 CSS API directly.' },
  { name: 'lottie-react-native', message: 'Rejected. Decorative motion by construction.' },
  { name: '@gorhom/bottom-sheet', message: 'Use the Expo Router formSheet presentation.' },
  { name: '@expo/vector-icons', message: 'Ships whole icon fonts. Content carries no icons.' },
  {
    name: 'react-native-vector-icons',
    message: 'Ships whole icon fonts. Content carries no icons.',
  },
  { name: 'redux', message: 'Rejected. Client state is Zustand.' },
  { name: '@reduxjs/toolkit', message: 'Rejected. Client state is Zustand.' },
  { name: 'effect', message: 'Rejected for src/. See docs/architecture/frontend-stack.md.' },
  // Barrel entrypoints, banned by exact name. A glob here would match every
  // legitimate direct import beneath these directories.
  {
    name: '@/components/ui',
    message: 'No barrel files. Import the defining module, e.g. @/components/ui/north-text.',
  },
  {
    name: '@/domains',
    message: 'No barrel files. Import the defining module inside the owning domain.',
  },
];

const BANNED_PATTERNS = [
  {
    group: ['@react-navigation/*'],
    message: 'Import from expo-router/react-navigation instead (SDK 56+).',
  },
];

module.exports = defineConfig([
  expoConfig,

  // App source. Routes, screens, primitives, domains, shell, platform.
  // src/theme.ts is generated and globally ignored below, so the hex-colour
  // ban here does not need an exception for it.
  {
    files: ['src/**/*.{ts,tsx}'],
    rules: {
      'no-restricted-imports': ['error', { paths: BANNED_PACKAGES, patterns: BANNED_PATTERNS }],
      'no-restricted-syntax': [
        'error',
        {
          selector: 'Literal[value=/^#(?:[0-9a-fA-F]{3,4}|[0-9a-fA-F]{6,8})$/]',
          message:
            'No raw hex colours. Add the token to DESIGN.md, run `make tokens`, and import from @/theme.',
        },
        {
          selector:
            "ImportDeclaration[source.value='react-native'] > ImportSpecifier[imported.name='Animated']",
          message: "Use react-native-reanimated, not React Native's Animated API.",
        },
        {
          selector:
            "ImportDeclaration[source.value='react-native'] > ImportSpecifier[imported.name='PlatformColor']",
          message: 'North uses a fixed dark palette. Use tokens from @/theme.',
        },
        {
          selector: "MemberExpression[object.name='Dimensions'][property.name='get']",
          message: 'Use useWindowDimensions so the value tracks rotation and resizing.',
        },
        {
          selector: "CallExpression[callee.name='require'][arguments.0.value=/\\.(wav|mp3)$/]",
          message: 'Sound assets are mono AAC (.m4a). See DESIGN.md, Sound and haptics.',
        },
      ],
    },
  },

  // Tests. These rules exist to stop shallow tests, not to enforce style.
  // The standard is in AGENTS.md: a test must fail if the behaviour it names
  // is wrong.
  {
    files: ['**/*.test.{ts,tsx}'],
    plugins: { jest: jestPlugin },
    rules: {
      ...jestPlugin.configs['flat/recommended'].rules,
      'jest/expect-expect': 'error',
      'jest/no-disabled-tests': 'error',
      'jest/no-focused-tests': 'error',
      'jest/no-identical-title': 'error',
      'jest/no-commented-out-tests': 'error',
      'jest/no-conditional-expect': 'error',
      'jest/valid-title': 'error',
      'jest/prefer-strict-equal': 'error',
      'jest/require-to-throw-message': 'error',
      // Snapshots record what the code does today, which the code already says.
      'jest/no-restricted-matchers': [
        'error',
        {
          toMatchSnapshot: 'No snapshot tests. Assert the value or the copy a person sees.',
          toMatchInlineSnapshot:
            'No snapshot tests. Assert the value or the copy a person sees.',
          toBeTruthy:
            'Existence is not behaviour. Assert the actual value. See AGENTS.md, Tests.',
          toBeFalsy:
            'Existence is not behaviour. Assert the actual value. See AGENTS.md, Tests.',
          toBeDefined:
            'Existence is not behaviour. Assert the actual value. See AGENTS.md, Tests.',
        },
      ],
    },
  },


  {
    ignores: ['content-api/**', 'dist/**', 'src/theme.ts'],
  },
]);
