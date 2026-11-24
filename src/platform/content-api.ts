import type { Catalogue } from '@/domains/content/catalogue';
import { isCatalogue } from '@/domains/content/catalogue';

/**
 * The read-only content API (content-api/ in this repository). It takes no
 * identity and receives nothing about the person. The app asks a few bytes,
 * "which version is published?", and downloads the catalogue only when that
 * version is newer than the copy it has. Matching happens on the phone.
 */
const CONTENT_URL = process.env.EXPO_PUBLIC_CONTENT_URL ?? 'https://north-content.farzin-nasiri.workers.dev';
const TIMEOUT_MS = 10_000;

async function get(path: string): Promise<unknown> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
  try {
    const response = await fetch(`${CONTENT_URL}${path}`, { signal: controller.signal });
    if (!response.ok) throw new Error(`Content API answered ${response.status}`);
    return await response.json();
  } finally {
    clearTimeout(timer);
  }
}

export async function fetchPublishedVersion(): Promise<number> {
  const body = (await get('/v1/version')) as { version?: unknown };
  if (typeof body?.version !== 'number') throw new Error('Content API sent no version.');
  return body.version;
}

export async function fetchCatalogue(): Promise<Catalogue> {
  const body = await get('/v1/catalogue');
  if (!isCatalogue(body)) throw new Error('Content API sent a catalogue the app cannot read.');
  return body;
}
