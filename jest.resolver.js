// Reanimated 4.7's Jest resolver (react-native-reanimated/jest/resolver),
// with exact package matching. Upstream matches any path that *contains*
// "react-native-worklets", and under pnpm that includes Reanimated's own folder
// (react-native-reanimated@x_react-native-worklets@y), so all of Reanimated
// would load its browser files. These rules match the package folders instead.
const WORKLETS = /[\\/]node_modules[\\/]react-native-worklets[\\/]/;
const REANIMATED = /[\\/]node_modules[\\/]react-native-reanimated[\\/]/;

// Reanimated files whose browser version is the one meant for Jest.
const WEB_ONLY_IN_JEST = [
  'initializers', 'mutables', 'mappers', 'ConfigHelper', 'UpdateLayoutAnimations',
  'useAnimatedRef', 'useAnimatedStyle', 'WorkletEventHandler', 'JSPropsUpdater',
  'updateProps', 'util', 'css/component/AnimatedComponent',
];

function withoutNative(request, options) {
  return options.defaultResolver(request, {
    ...options,
    extensions: options.extensions?.filter((extension) => !extension.includes('native')),
  });
}

/** @type {import('jest-resolve').SyncResolver} */
module.exports = (request, options) => {
  const basename = request.split('/').pop();
  const webOnly = WEB_ONLY_IN_JEST.some((entry) =>
    entry.includes('/') ? request.endsWith(entry) : basename === entry);
  if (request.startsWith('.') && webOnly && REANIMATED.test(options.basedir)) {
    return withoutNative(request, options);
  }
  if (WORKLETS.test(options.basedir) || request === 'react-native-worklets'
    || request.startsWith('react-native-worklets/')) {
    return withoutNative(request, options);
  }
  return options.defaultResolver(request, options);
};
