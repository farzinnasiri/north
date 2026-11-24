import type { ConfigContext, ExpoConfig } from 'expo/config';

export default ({ config }: ConfigContext): ExpoConfig => {
  const environment = process.env.EXPO_PUBLIC_APP_ENV ?? 'development';
  if (!['development', 'production'].includes(environment)) throw new Error('Invalid EXPO_PUBLIC_APP_ENV');
  const variant = process.env.NORTH_APP_VARIANT ?? 'production';
  if (!['development', 'preview', 'production'].includes(variant)) throw new Error('Invalid NORTH_APP_VARIANT');
  const suffix = variant === 'production' ? '' : `.${variant}`;
  return {
    ...config,
    name: variant === 'production' ? 'North' : variant === 'development' ? 'North Development' : 'North Preview',
    slug: 'north',
    scheme: variant === 'production' ? 'north' : `north-${variant}`,
    ios: { ...config.ios, bundleIdentifier: `com.oooflabs.north${suffix}`, config: { ...config.ios?.config, usesNonExemptEncryption: false } },
    android: { ...config.android, package: `com.oooflabs.north${suffix}` },
    plugins: [...(config.plugins ?? []), ['expo-dev-client', { addGeneratedScheme: variant === 'development' }]],
    extra: { ...config.extra, environment },
  };
};
