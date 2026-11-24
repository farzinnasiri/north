# North content API

A Cloudflare Worker that serves North's catalogue of Lines, read-only.

- `GET /v1/version` returns `{ version, count }`, a few bytes. The app checks it
  at most once an hour and downloads the catalogue only when the version is
  newer than its copy.
- `GET /v1/catalogue` returns `{ version, lines }`, each line with `person`,
  `said`, `kind`, `source`, `url`, `takeaway`, `action`, `axis` and `themes`.
- Anything else is `404`, and any method but `GET`/`HEAD` is `405`.
- 30 requests a minute per IP (Cloudflare rate-limit binding), then `429`.
- Each isolate keeps the built response for five minutes and asks D1 only for
  the version number in between.

The Worker has no code path that writes to the database and takes no identity.
The app downloads the whole catalogue and matches Lines on the phone, so nothing
about the person reaches this server.

## Writing content

Content is written only from `data/lines.jsonl` with your own Cloudflare login:

```bash
make content-check   # validate
make content-push    # upload a new version, verify the count, then switch to it
```

A push writes every row under a new version, checks the count, and only then
moves `meta.version`, so the API never serves half an upload. It needs a `cf`
login with D1 access: run `cf auth login --force` and grant D1 on the consent
screen.

## Resources

- Worker: `north-content`, `https://north-content.farzin-nasiri.workers.dev`
- D1 database: `north-content` (`fd5867e8-df74-4483-a555-8b3beb108161`)
- Schema: `schema.sql`

Deploy after changing `src/` with `make content-deploy` from the repository root.
