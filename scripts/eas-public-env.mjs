import { spawnSync } from 'node:child_process';

const [action = 'check', environment = 'development'] = process.argv.slice(2);
if (!['check', 'sync'].includes(action) || !['development', 'preview', 'production'].includes(environment)) {
  throw new Error('Use eas-public-env.mjs check|sync development|preview|production');
}
// North has no account or analytics keys. The content API URL has a built-in
// default, so it is the only optional public setting.
const optional = ['EXPO_PUBLIC_CONTENT_URL'];
if (action === 'check') {
  console.log(`North needs no required public settings for EAS ${environment}.`);
} else {
  for (const name of optional) {
    if (!process.env[name]) continue;
    const result = spawnSync('pnpm', ['dlx', 'eas-cli@25.2.0', 'env:create', environment,
      '--name', name, '--value', process.env[name], '--visibility', 'plaintext', '--scope', 'project', '--force', '--non-interactive'],
    { stdio: 'inherit', env: { ...process.env, EXPO_NO_DOTENV: '1' } });
    if (result.error) throw result.error;
    if (result.status !== 0) process.exit(result.status ?? 1);
  }
}
