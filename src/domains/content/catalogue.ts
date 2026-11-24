import type { Axis } from '@/domains/direction/initial-direction';

import bundled from './catalogue.json';

/**
 * The things a man is struggling with, as he named them in onboarding. A Line
 * carries the ones its action speaks to, so his answer can lead the first
 * suggestion without any text leaving the phone.
 */
export type Theme = 'conversation' | 'unstarted' | 'habit' | 'apology' | 'body' | 'money';

/**
 * One published line: something a named person said, with its source, and one
 * action a man could finish in a day because of it. North shows the words with
 * their attribution and never rewrites them.
 */
export type Line = {
  /** How to do it: one concrete step a man could finish in a day. */
  action: string;
  axis: Axis;
  id: string;
  kind: 'quote' | 'paraphrase';
  person: string;
  /** At most two sentences. A paraphrase is labelled as one wherever it shows. */
  said: string;
  /** Book, talk, essay, or post. */
  source: string;
  /** Today's thing in a few words, drawn from the quote. The Action starts as this. */
  takeaway: string;
  themes: readonly Theme[];
  url: string | null;
};

export type Catalogue = {
  lines: readonly Line[];
  /** Publish time of this catalogue, in seconds. Newer replaces older. */
  version: number;
};

const AXES: readonly Axis[] = ['frame', 'desire', 'connection', 'appetite', 'craft', 'agency'];
const THEMES: readonly Theme[] = ['conversation', 'unstarted', 'habit', 'apology', 'body', 'money'];

/** The copy that ships inside the app, so the first launch works offline. */
export const BUNDLED_CATALOGUE = bundled as Catalogue;

/**
 * Anything from the network or from storage is checked line by line before
 * the app trusts it. One malformed line rejects the whole catalogue: a partial
 * list would quietly change which suggestions a man sees.
 */
export function isCatalogue(value: unknown): value is Catalogue {
  if (typeof value !== 'object' || value === null) return false;
  const candidate = value as { lines?: unknown; version?: unknown };
  if (typeof candidate.version !== 'number' || !Array.isArray(candidate.lines)) return false;
  if (candidate.lines.length === 0) return false;
  return candidate.lines.every(isLine);
}

function isLine(value: unknown): value is Line {
  if (typeof value !== 'object' || value === null) return false;
  const line = value as Record<string, unknown>;
  return (
    typeof line.id === 'string' &&
    typeof line.person === 'string' &&
    typeof line.said === 'string' &&
    (line.kind === 'quote' || line.kind === 'paraphrase') &&
    typeof line.source === 'string' &&
    typeof line.takeaway === 'string' &&
    line.takeaway.trim() !== '' &&
    (line.url === null || typeof line.url === 'string') &&
    typeof line.action === 'string' &&
    AXES.includes(line.axis as Axis) &&
    Array.isArray(line.themes) &&
    line.themes.every((theme) => THEMES.includes(theme as Theme))
  );
}

export function lineById(catalogue: Catalogue, id: string): Line | undefined {
  return catalogue.lines.find((line) => line.id === id);
}
