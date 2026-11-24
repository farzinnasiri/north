#!/usr/bin/env node
/**
 * North's content pipeline. data/lines.jsonl is the one file to edit.
 *
 *   node scripts/content.mjs check      validate data/lines.jsonl
 *   node scripts/content.mjs snapshot   write the copy bundled in the app
 *   node scripts/content.mjs push       publish to the D1 database behind the API
 *   node scripts/content.mjs sql FILE   write the same publish as one SQL file
 *
 * Each Line carries a one-line `takeaway`: the thing to do today, in a few words.
 * A push writes every line under a new version number, checks the count, and
 * only then points meta.version at it, so the API never serves half an upload.
 * It runs `cf d1 query` with your own Cloudflare login; nothing else can write.
 */
import { execFileSync } from 'node:child_process';
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const ROOT = new URL('..', import.meta.url).pathname;
const SOURCE = join(ROOT, 'data/lines.jsonl');
const SNAPSHOT = join(ROOT, 'src/domains/content/catalogue.json');
const DATABASE_ID = 'fd5867e8-df74-4483-a555-8b3beb108161';

const AXES = ['frame', 'desire', 'connection', 'appetite', 'craft', 'agency'];
const THEMES = ['conversation', 'unstarted', 'habit', 'apology', 'body', 'money'];
const KINDS = ['quote', 'paraphrase'];

function read() {
  const lines = readFileSync(SOURCE, 'utf8').split('\n').filter((line) => line.trim() !== '');
  const rows = lines.map((line, index) => {
    try {
      return JSON.parse(line);
    } catch {
      throw new Error(`data/lines.jsonl:${index + 1} is not valid JSON`);
    }
  });
  const problems = [];
  const seen = new Set();
  rows.forEach((row, index) => {
    const at = `line ${index + 1} (${row.id ?? 'no id'})`;
    for (const field of ['id', 'person', 'said', 'said_kind', 'source_title', 'do', 'takeaway', 'axis']) {
      if (typeof row[field] !== 'string' || row[field].trim() === '') problems.push(`${at}: ${field} is missing`);
    }
    if (seen.has(row.id)) problems.push(`${at}: duplicate id`);
    seen.add(row.id);
    if (!AXES.includes(row.axis)) problems.push(`${at}: axis must be one of ${AXES.join(', ')}`);
    if (!KINDS.includes(row.said_kind)) problems.push(`${at}: said_kind must be quote or paraphrase`);
    if (!Array.isArray(row.themes) || row.themes.some((theme) => !THEMES.includes(theme))) {
      problems.push(`${at}: themes must be a list drawn from ${THEMES.join(', ')}`);
    }
    if (row.source_url !== null && !/^https:\/\/[^\s]+$/.test(row.source_url ?? '')) {
      problems.push(`${at}: source_url must be an https URL or null`);
    }
    if (/drive\.google\.com|docs\.google\.com/.test(row.source_url ?? '')) {
      problems.push(`${at}: private Drive links must not be published`);
    }
  });
  if (problems.length > 0) {
    throw new Error(`data/lines.jsonl has ${problems.length} problem(s):\n${problems.slice(0, 40).join('\n')}`);
  }
  return rows;
}

/** The shape the API serves and the app reads. Keep in step with content-api/src/index.ts. */
function published(row) {
  return {
    id: row.id,
    person: row.person,
    said: row.said,
    kind: row.said_kind,
    source: row.source_title,
    url: row.source_url,
    takeaway: row.takeaway,
    action: row.do,
    axis: row.axis,
    themes: row.themes,
  };
}

function snapshot(rows, version) {
  const sorted = [...rows].sort((a, b) => (a.id < b.id ? -1 : a.id > b.id ? 1 : 0));
  writeFileSync(SNAPSHOT, `${JSON.stringify({ version, lines: sorted.map(published) })}\n`);
  console.log(`wrote ${sorted.length} lines to src/domains/content/catalogue.json (version ${version})`);
}

const INSERT =
  'INSERT INTO lines (version, id, person, said, said_kind, source_title, source_url, takeaway, action, axis, themes) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';

function values(row, version) {
  return [String(version), row.id, row.person, row.said, row.said_kind, row.source_title,
    row.source_url, row.takeaway, row.do, row.axis, JSON.stringify(row.themes)];
}

function cf(args) {
  return execFileSync('cf', args, { encoding: 'utf8', stdio: ['ignore', 'pipe', 'inherit'] });
}

function push(rows) {
  const version = Math.floor(Date.now() / 1000);
  const dir = mkdtempSync(join(tmpdir(), 'north-content-'));
  try {
    cf(['d1', 'query', DATABASE_ID, `--sql=${readFileSync(join(ROOT, 'content-api/schema.sql'), 'utf8')}`]);
    for (let start = 0; start < rows.length; start += 50) {
      const file = join(dir, `batch-${start}.json`);
      const batch = rows.slice(start, start + 50).map((row) => ({ sql: INSERT, params: values(row, version) }));
      writeFileSync(file, JSON.stringify(batch));
      cf(['d1', 'query', DATABASE_ID, `--batch=@${file}`]);
      process.stdout.write(`\ruploaded ${Math.min(start + 50, rows.length)} / ${rows.length}`);
    }
    process.stdout.write('\n');
    const counted = JSON.parse(cf(['d1', 'query', DATABASE_ID,
      `--sql=SELECT COUNT(*) AS n FROM lines WHERE version = ${version}`]));
    const n = JSON.stringify(counted).match(/"n":\s*(\d+)/)?.[1];
    if (Number(n) !== rows.length) throw new Error(`Uploaded ${n} rows, expected ${rows.length}. Nothing was switched.`);
    cf(['d1', 'query', DATABASE_ID,
      `--sql=INSERT INTO meta (key, value) VALUES ('version', '${version}') ON CONFLICT(key) DO UPDATE SET value = excluded.value; DELETE FROM lines WHERE version <> ${version}`]);
    console.log(`published version ${version}: ${rows.length} lines`);
    snapshot(rows, version);
  } finally {
    rmSync(dir, { force: true, recursive: true });
  }
}

function sql(rows, file) {
  const version = Math.floor(Date.now() / 1000);
  const quote = (value) => (value === null ? 'NULL' : `'${String(value).replaceAll("'", "''")}'`);
  const statements = [readFileSync(join(ROOT, 'content-api/schema.sql'), 'utf8')];
  for (const row of rows) {
    const [v, ...rest] = values(row, version);
    statements.push(`INSERT INTO lines (version, id, person, said, said_kind, source_title, source_url, takeaway, action, axis, themes) VALUES (${v}, ${rest.map(quote).join(', ')});`);
  }
  statements.push(`INSERT INTO meta (key, value) VALUES ('version', '${version}') ON CONFLICT(key) DO UPDATE SET value = excluded.value;`);
  statements.push(`DELETE FROM lines WHERE version <> ${version};`);
  writeFileSync(file, `${statements.join('\n')}\n`);
  console.log(`wrote ${file} (version ${version})`);
  snapshot(rows, version);
}

const [command, argument] = process.argv.slice(2);
try {
  const rows = read();
  if (command === 'check') console.log(`data/lines.jsonl is valid: ${rows.length} lines`);
  else if (command === 'snapshot') snapshot(rows, 0);
  else if (command === 'push') push(rows);
  else if (command === 'sql' && argument) sql(rows, argument);
  else throw new Error('Usage: node scripts/content.mjs check | snapshot | push | sql FILE');
} catch (cause) {
  console.error(cause instanceof Error ? cause.message : cause);
  process.exit(1);
}
