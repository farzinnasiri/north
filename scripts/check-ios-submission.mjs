import { readFileSync } from 'node:fs';

// Stop before spending build minutes while first-time App Store Connect setup is incomplete.
const { submit } = JSON.parse(readFileSync(new URL('../eas.json', import.meta.url), 'utf8'));
const appId = submit?.testflight?.ios?.ascAppId;
if (typeof appId !== 'string' || !/^\d+$/.test(appId)) {
  console.error('Create the App Store Connect record from docs/EXPO-DEVELOPMENT.md, then run make ios-app-link to save its numeric Apple ID. No build or upload was started.');
  process.exit(1);
}
