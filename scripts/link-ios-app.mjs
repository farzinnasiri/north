import { readFileSync, writeFileSync } from 'node:fs';
import { execFileSync } from 'node:child_process';

const file = new URL('../eas.json', import.meta.url);
const config = JSON.parse(readFileSync(file, 'utf8'));
const profile = config.submit.testflight.ios;
const result = JSON.parse(execFileSync('asc', ['--profile', process.env.ASC_PROFILE || 'oooflabs',
  'apps', 'list', '--bundle-id', profile.bundleIdentifier, '--output', 'json'], { encoding: 'utf8' }));
if (result.data.length !== 1 || result.data[0].attributes.bundleId !== profile.bundleIdentifier) {
  throw new Error(`Create the App Store Connect record for ${profile.bundleIdentifier} using docs/EXPO-DEVELOPMENT.md, then run make ios-app-link again. No build or upload was started.`);
}
const appId = result.data[0].id;
if (!/^\d+$/.test(appId)) throw new Error('App Store Connect returned an invalid app ID.');
if (profile.ascAppId && profile.ascAppId !== appId) throw new Error('Refusing to replace a different configured app ID.');
profile.ascAppId = appId;
writeFileSync(file, `${JSON.stringify(config, null, 2)}\n`);
console.log(`Linked ${profile.bundleIdentifier} to App Store Connect app ${appId}. No build or upload was started.`);
