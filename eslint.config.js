const { defineConfig } = require('eslint/config');
const convexPlugin = require('@convex-dev/eslint-plugin');
const expoConfig = require('eslint-config-expo/flat');

module.exports = defineConfig([
  expoConfig,
  {
    files: ['convex/**/*.ts'],
    plugins: {
      '@convex-dev': convexPlugin,
    },
    rules: {
      '@convex-dev/explicit-table-ids': 'error',
      '@convex-dev/no-filter-in-query': 'warn',
      '@convex-dev/no-old-registered-function-syntax': 'error',
      '@convex-dev/no-top-of-hour-crons': 'warn',
      '@convex-dev/require-args-validator': 'error',
    },
  },
  {
    ignores: ['convex/_generated/**', 'dist/**'],
  },
]);
