// Generates src/theme.ts from the DESIGN.md frontmatter.
//
// DESIGN.md is the source of truth for tokens. It names them the way the
// design spec does (semantic roles); North names them the way the product
// talks (field, brass, meridian). The maps below are the only place those two
// vocabularies meet.
//
//   node scripts/tokens.ts            rewrite src/theme.ts
//   node scripts/tokens.ts --check    fail if src/theme.ts is stale

import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

import { parse } from 'yaml';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const designPath = join(root, 'DESIGN.md');
const themePath = join(root, 'src', 'theme.ts');

const COLORS: Record<string, string> = {
  'surface': 'fieldDeep',
  'surface-container': 'field',
  'surface-container-high': 'fieldRaised',
  'outline': 'line',
  'outline-soft': 'lineSoft',
  'primary': 'brass',
  'primary-hover': 'brassHover',
  'primary-muted': 'brassDim',
  'on-primary': 'brassOn',
  'secondary': 'meridian',
  'secondary-light': 'meridianLight',
  'error': 'ember',
  'error-light': 'emberLight',
  'error-text': 'emberText',
  'on-surface': 'paper',
  'on-surface-muted': 'ash',
  'on-surface-subtle': 'slate',
  'signal-gold': 'signalGold',
  'signal-gold-light': 'signalGoldLight',
  'signal-gold-muted': 'signalGoldMuted',
  'signal-tide': 'signalTide',
  'signal-tide-light': 'signalTideLight',
  'signal-tide-muted': 'signalTideMuted',
  'signal-cobalt': 'signalCobalt',
  'signal-cobalt-light': 'signalCobaltLight',
  'signal-cobalt-muted': 'signalCobaltMuted',
  'axis-agency': 'axisAgency',
  'axis-frame': 'axisFrame',
  'axis-desire': 'axisDesire',
  'axis-connection': 'axisConnection',
  'axis-appetite': 'axisAppetite',
  'axis-craft': 'axisCraft',
  'glass-fill': 'glassFill',
  'glass-edge': 'glassEdge',
  'glass-highlight': 'glassHighlight',
};

const SPACING: Record<string, string> = {
  xs: 'xs',
  sm: 'sm',
  md: 'md',
  lg: 'lg',
  'screen-horizontal': 'screen',
  xl: 'xl',
  '2xl': 'xxl',
  '3xl': 'xxxl',
};

const TYPE_SCALE: Record<string, string> = {
  display: 'display',
  'daily-line': 'title',
  heading: 'heading',
  body: 'body',
  'body-small': 'small',
  data: 'data',
  label: 'label',
};

// Font files embedded by the expo-font config plugin in app.json. The family
// name a platform reports is the filename, so this map is about build output,
// not design intent, and stays out of DESIGN.md.
const FONT_FILES = {
  editorial: 'BarlowCondensed_600SemiBold',
  editorialMedium: 'BarlowCondensed_700Bold',
  sans: 'Inter_400Regular',
  sansMedium: 'Inter_500Medium',
  mono: 'JetBrainsMono_400Regular',
  monoMedium: 'JetBrainsMono_500Medium',
};

type Design = {
  colors: Record<string, string>;
  typography: Record<string, { fontSize?: string }>;
  rounded: Record<string, string>;
  spacing: Record<string, string>;
  motion: Record<string, string | number>;
  sound: Record<string, string>;
};

function frontmatter(): Design {
  const raw = readFileSync(designPath, 'utf8');
  const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!match) {
    throw new Error('DESIGN.md has no YAML frontmatter.');
  }
  return parse(match[1]) as Design;
}

function px(value: string, path: string): number {
  const parsed = Number.parseFloat(String(value));
  if (Number.isNaN(parsed)) {
    throw new Error(`${path} is not a number: ${value}`);
  }
  return parsed;
}

function pick<T>(
  source: Record<string, T>,
  map: Record<string, string>,
  section: string,
): [string, T][] {
  return Object.entries(map).map(([from, to]) => {
    const value = source?.[from];
    if (value === undefined) {
      throw new Error(`DESIGN.md is missing ${section}.${from}, required by theme.${to}.`);
    }
    return [to, value];
  });
}

// No explicit type annotation: `as const` on the bare literal is what gives
// consumers exact key types, so `colors.brasss` fails to compile.
function block(name: string, entries: [string, string | number][]): string {
  const body = entries
    .map(([key, value]) => `  ${key}: ${typeof value === 'number' ? value : `'${value}'`},`)
    .join('\n');
  return `export const ${name} = {\n${body}\n} as const;\n`;
}

function render(design: Design): string {
  const colors = pick(design.colors, COLORS, 'colors').map(
    ([key, value]) => [key, value] as [string, string],
  );
  const spacing = pick(design.spacing, SPACING, 'spacing').map(
    ([key, value]) => [key, px(value, `spacing.${key}`)] as [string, number],
  );
  const radii = Object.entries(design.rounded).map(
    ([key, value]) => [key, px(value, `rounded.${key}`)] as [string, number],
  );
  const typeScale = pick(design.typography, TYPE_SCALE, 'typography').map(
    ([key, value]) => [key, px(value.fontSize ?? '', `typography.${key}.fontSize`)] as [string, number],
  );

  const motion = Object.entries(design.motion).map(([key, value]) => {
    const camel = key.replace(/-([a-z])/g, (_, c: string) => c.toUpperCase());
    return typeof value === 'number'
      ? ([camel, value] as [string, number])
      : ([camel, /^\d+ms$/.test(value) ? px(value, `motion.${key}`) : value] as [
          string,
          string | number,
        ]);
  });
  const sound = Object.entries(design.sound).map(
    ([key, value]) =>
      [
        key.replace(/-([a-z])/g, (_, c: string) => c.toUpperCase()),
        px(value, `sound.${key}`),
      ] as [string, number],
  );

  return [
    '// Generated from DESIGN.md by scripts/tokens.mts. Do not edit by hand.',
    '// Change DESIGN.md and run `make tokens`.',
    '',
    block('colors', colors),
    block('typography', Object.entries(FONT_FILES) as [string, string][]),
    block('spacing', spacing),
    block('radii', radii),
    block('typeScale', typeScale),
    '// Durations in milliseconds; needle values feed a Reanimated spring.',
    block('motion', motion),
    '// Maximum duration in milliseconds for each of the four cues.',
    block('sound', sound),
  ].join('\n');
}

const next = render(frontmatter());

if (process.argv.includes('--check')) {
  const current = readFileSync(themePath, 'utf8');
  if (current !== next) {
    console.error('src/theme.ts is stale. Run `make tokens`.');
    process.exit(1);
  }
  console.log('src/theme.ts matches DESIGN.md.');
} else {
  writeFileSync(themePath, next);
  console.log('Wrote src/theme.ts from DESIGN.md.');
}
