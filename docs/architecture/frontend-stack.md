# Frontend stack

Technology decisions for the North app, with the reasoning that produced them
and the alternatives that were rejected. `AGENTS.md` states the rules; this file
states why they exist. Read this before proposing a different library, and
change it in the same commit that changes a decision.

Settled 2026-08-11 against Expo SDK 57, React Native 0.86, React 19.2.

## Governing rule

North uses **native chrome and bespoke content**. The full statement lives in
`DESIGN.md` under Platform surface, because it is a design decision before it is
a technical one. Every choice below follows from it: the platform supplies
navigation, sheets, keyboard, and scroll; North draws everything a person came
here to look at.

## Targets

iOS and Android are the product targets. Web is a development-preview surface
for reviewing layout, flow, and copy quickly; it is not shipped and parity is
not a requirement.

The preview must not reopen native product decisions. Native tabs, sheets,
haptics, symbols, and platform behavior remain authoritative. When one prevents
the web bundle from compiling, isolate the smallest fallback in a `.web` module
instead of weakening the native implementation. Acceptance testing remains on
iOS and Android.

## Decisions

| Concern | Decision | Why |
| --- | --- | --- |
| Navigation | Expo Router, native `Stack` | Now is the only root; Log and You use native push and back gestures |
| Sheets | Expo Router `presentation: 'formSheet'` with detents | Already native; a sheet library would add a dependency to reimplement it worse |
| Styling | React Native `StyleSheet` with tokens from `src/theme.ts` | Fastest available, no build step, and North has one structural theme plus four authored Signal families. A styling library would be paying setup and runtime cost for variants the product does not need |
| Tokens | `DESIGN.md` frontmatter is the source; `src/theme.ts` is generated | The two drifted while both were hand-maintained. One direction, checked by `make check` |
| Animation | Reanimated 4 with `react-native-worklets` | New-Architecture-only and current. Use the CSS API for state-driven transitions, shared values for the needle and gestures, `entering`/`exiting`/`layout` for mount and reorder |
| Gestures | `react-native-gesture-handler` | Required by Reanimated gesture work and by signature capture |
| Vector drawing | `react-native-svg` | The Compass and the crosshair field are bespoke product instruments, animated through Reanimated without a second rendering system |
| Icons | One bespoke Settings gear in content. `NativeTabs` `sf`/`md` props for chrome | The gear is a universally learned route into Settings; native tab icons cost nothing and match each platform. An icon-font dependency remains unjustified |
| View capture | `react-native-view-shot` | Captures the bounded Reality card as PNG on native and the web review surface without capturing surrounding controls |
| Photo save | `expo-media-library` | Adds the captured Reality card to Photos with write-only photo permission rather than requesting broad library access |
| Sound | `expo-audio`, three app-lifetime players | Navigation must not clip a cue; loading on press is audibly late |
| Haptics | `expo-haptics`, `performAndroidHapticsAsync` on Android | Avoids needing the `VIBRATE` permission and matches iOS semantics |
| Client state | Zustand | About 1KB, no boilerplate, and the smallest thing that survives contact with a real app |
| Local persistence | `expo-sqlite` `localStorage` polyfill | Holds the Journey, the onboarding draft, and the downloaded content catalogue. There is no server copy |
| Content | Cloudflare Worker + D1 (`content-api/`), bundled snapshot | Read-only catalogue of Lines. The app downloads it whole and matches on the phone, so nothing about the person is sent |
| Native development | SDK-matched `expo-dev-client`, EAS cloud builds, Metro | Own app identity and native dependencies for device testing; reuse the client for JavaScript edits. Expo Go remains an optional supported preview. See `docs/EXPO-DEVELOPMENT.md` |
| Liquid Glass | `expo-glass-effect`, native tabs, native sheets and headers | The system's own iOS 26 material for chrome, buttons and cards, with a translucent fallback elsewhere |
| Check-in | `expo-notifications` | One local notification at his chosen time, with Done / Partly / Missed actions. Nothing remote |
| Forms | `react-hook-form` with `zod` when onboarding is built | Not yet installed. Onboarding is the only real form surface |
| Runtime validation | `zod` at boundaries only | Onboarding answers and persisted-state migration. Not for internal function arguments |
| Unit and component tests | `jest-expo` with `@testing-library/react-native` | `node --test` cannot render React Native components |
| Lint | ESLint 9 flat config with `eslint-config-expo` | Already present. Extended to mechanize the bans below |

## Rejected

Recorded so they are not re-proposed. Each was considered for North
specifically, not in the abstract.

| Rejected | Reason |
| --- | --- |
| Effect-TS | Its payoff is typed errors, resource safety, retries, and fibers — all of which are backend concerns. `src/` is a frontend prototype with no network, no async, and no concurrency. It would add a large runtime and a second mental model for no current benefit. If it ever earns a place, that place is the content Worker |
| NativeWind, Uniwind, Tailwind | A utility-class model competing with a token model, plus a build step. North already has tokens |
| Unistyles | A good library whose features are broad variants and theming. North changes one semantic Signal family through a tiny context, not its structure |
| Tamagui | Brings its own design system, which is the thing `DESIGN.md` already is |
| shadcn/ui, react-native-reusables | A copy-paste catalogue of dialogs, cards, badges, and accordions — most of which `DESIGN.md` explicitly bans — that also requires NativeWind |
| React Native Skia | Adds roughly 3–5MB of native binaries. North draws one dial that rotates. The right tool for shaders and large datasets, and enormously oversized for this |
| Lottie | Decorative motion by construction, and the Motion section rules out everything it is good at |
| `@gorhom/bottom-sheet` | Native form sheets already do this |
| `@expo/vector-icons`, `react-native-vector-icons` | Ship entire icon fonts. Also moot while content has no icons |
| Redux, Redux Toolkit | Roughly 11KB and an architecture with no problem to solve here |
| `expo-av` | Deprecated in favour of `expo-audio` and `expo-video` |
| AsyncStorage | Removed from React Native core |
| Platform semantic colors (`Color`, `PlatformColor`) | North has one fixed mineral palette. System colors would fight the tokens, and Reanimated cannot consume them anyway |
| Moti | A wrapper over Reanimated whose ergonomics the Reanimated 4 CSS API now provides directly |
| `@react-native-picker/picker` | Added for the onboarding age field and removed on 2026-08-11. Picking one number from forty-five renders as a wheel on iOS and a full-height list on web, and it was the only piece of system chrome in a flow built from hairlines and marks. Replaced by `NumberTape`, a measuring tape read against a fixed index. Use a native picker only where the system look is genuinely correct |
| TanStack Query | One request, twice a day, for a whole catalogue. A small store in `@/domains/content/store` is enough |

## Budgets

Cheaper to hold than to recover. Measure with `pnpm dlx expo-atlas` before a release,
not once.

| Budget | Limit |
| --- | --- |
| iOS `.ipa` | 25MB |
| Android `.aab` | 15MB |
| JavaScript bundle | 1.2MB |
| Cold start to interactive, mid-range Android | 1.2s |
| Sound assets, all three combined | 20KB |

Standing rules that protect them: no barrel files, because re-exporting defeats
tree shaking; `expo-image` rather than `Image` if raster assets ever appear;
fonts embedded at build time rather than fetched at runtime; and React Compiler
left enabled in `app.json`.

## Testing standards

The rules are in `AGENTS.md`. The reasoning is here, because the failure mode is
specific and worth naming.

The risk in this codebase is not too few tests. It is a large number of tests
that assert almost nothing — rendering a component and checking it is truthy,
snapshotting a tree, or confirming a function returns something. These pass
against a broken implementation, so they cost review time and maintenance while
providing no signal, and they make coverage numbers actively misleading.

The standard is therefore stated as a property rather than a count: **a test
must fail if the behaviour it names is wrong.** The practical consequences:

- The direction rules are the highest-risk logic in the product and get exhaustive
  tests using the literal numbers from `north-product-spec.html` — 1.0° base,
  −0.05° per deadline day, 0.65° at seven days, 0° for a missed deadline, and no
  backward movement. The spec explicitly warns about a sandbagging exploit if an
  early-finish bonus is added naively; that case gets a test before the bonus
  gets an implementation.
- Component tests assert what a person sees and can do, not internal state or
  structure.
- Snapshots are banned. A snapshot records what the code currently does, which
  is the one thing already knowable from the code.
- Assertions on existence alone — truthy, defined, not-null, `toBeTruthy` — do
  not count as the assertion of a test.

## Enforced automatically

The bans above are mechanized in `eslint.config.js` rather than left to
review: restricted imports for every rejected library, restricted syntax for
React Native's `Animated`, `PlatformColor`, and `Dimensions.get`, raw hex colors
outside the generated theme, and the `jest` plugin rules covering snapshots,
empty tests, and focused or skipped tests.

`make check` runs lint, type checking, tests, the design lint, and the token
freshness check.

## Known deviations

`designmd lint` emits two `token-like-ignored` warnings, for the `motion` and
`sound` blocks in `DESIGN.md`. They are expected and should not be "fixed" by
deleting the blocks. The rule warns that non-schema token maps are ignored by
the tool's own export commands; North does not use those commands, and reads the
frontmatter directly in `scripts/tokens.ts`. Keeping motion and sound versioned
beside color and type — in the one file that is the design contract — is worth
two advisory warnings. The command still exits zero.

## Open

- **Dynamic Type cap.** `DESIGN.md` requires honouring system text size up to a
  capped multiplier. The cap is not yet chosen.

## Settled after the initial stack decision

- **Main navigation, 2026-10-08.** Now is the only root. Log and You are pushed
  screens; Commit, Closeout, and Note use native form sheets. Native tabs and
  the development web dock are removed. This supersedes the 2026-08-25 tab
  decision. The accepted product contract is `docs/product/app-after-onboarding.md`.
