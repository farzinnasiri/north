-- North content catalogue. Read by the Worker, written only by scripts/content.mjs.
-- Every push writes a new version of every row, then switches meta.version, so a
-- half-finished upload is never served.
CREATE TABLE IF NOT EXISTS lines (
  version INTEGER NOT NULL,
  id TEXT NOT NULL,
  person TEXT NOT NULL,
  said TEXT NOT NULL,
  said_kind TEXT NOT NULL CHECK (said_kind IN ('quote', 'paraphrase')),
  source_title TEXT NOT NULL,
  source_url TEXT,
  takeaway TEXT NOT NULL DEFAULT '',
  action TEXT NOT NULL,
  axis TEXT NOT NULL CHECK (axis IN ('frame', 'desire', 'connection', 'appetite', 'craft', 'agency')),
  themes TEXT NOT NULL DEFAULT '[]',
  PRIMARY KEY (version, id)
);
CREATE TABLE IF NOT EXISTS meta (key TEXT PRIMARY KEY, value TEXT NOT NULL);
