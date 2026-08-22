// Reanimated's Jest helpers. Registers the animated-style matchers and the
// fake clock the needle tests will need, and keeps animated components from
// throwing when they are rendered in a test.
import { setUpTests } from 'react-native-reanimated';

setUpTests();

// React warnings are defects, not noise. A test that renders a broken tree
// should fail here rather than pass with a warning nobody reads.
const failOnConsole = (method: 'error' | 'warn') => {
  const original = console[method];
  beforeEach(() => {
    console[method] = (...args: unknown[]) => {
      original(...args);
      throw new Error(`console.${method} during test: ${String(args[0])}`);
    };
  });
  afterEach(() => {
    console[method] = original;
  });
};

failOnConsole('error');
