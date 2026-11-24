/**
 * North's content API. Two read-only endpoints, no accounts, no writes.
 *
 * GET /v1/version returns { version, count }: a few bytes the app checks to see
 * whether anything changed. GET /v1/catalogue returns every published line; the
 * app downloads it only when the version is newer than its copy, and matches
 * on the phone, so nothing about the person ever reaches this server.
 *
 * Writes happen only through scripts/content.mjs with the owner's Cloudflare
 * login; this Worker has no code path that changes the database.
 */
type Env = {
	DB: D1Database;
	LIMITER: RateLimit;
};

type Row = {
	id: string;
	person: string;
	said: string;
	said_kind: string;
	source_title: string;
	source_url: string | null;
	takeaway: string;
	action: string;
	axis: string;
	themes: string;
};

type Cached = { body: string; checkedAt: number; count: number; etag: string; version: number };

/** How long an isolate trusts its copy before it asks D1 for the version again. */
const RECHECK_MS = 5 * 60 * 1000;
let cached: Cached | null = null;

const BASE_HEADERS = {
	"Access-Control-Allow-Origin": "*",
	"X-Content-Type-Options": "nosniff",
};

export default {
	async fetch(request: Request, env: Env): Promise<Response> {
		const url = new URL(request.url);
		if (request.method === "OPTIONS") {
			return new Response(null, {
				status: 204,
				headers: { ...BASE_HEADERS, "Access-Control-Allow-Methods": "GET, HEAD", "Access-Control-Max-Age": "86400" },
			});
		}
		if (request.method !== "GET" && request.method !== "HEAD") {
			return error(405, "Read only.", { Allow: "GET, HEAD" });
		}
		if (url.pathname !== "/v1/catalogue" && url.pathname !== "/v1/version") return error(404, "Not found.");

		const ip = request.headers.get("cf-connecting-ip") ?? "unknown";
		const { success } = await env.LIMITER.limit({ key: ip });
		if (!success) return error(429, "Too many requests.", { "Retry-After": "60" });

		let catalogue: Cached;
		try {
			catalogue = await load(env.DB);
		} catch {
			return error(503, "Catalogue unavailable.", { "Retry-After": "300" });
		}

		if (url.pathname === "/v1/version") {
			return new Response(JSON.stringify({ count: catalogue.count, version: catalogue.version }), {
				headers: { ...BASE_HEADERS, "Cache-Control": "public, max-age=300", "Content-Type": "application/json; charset=utf-8" },
			});
		}

		const headers = {
			...BASE_HEADERS,
			"Cache-Control": "public, max-age=3600",
			"Content-Type": "application/json; charset=utf-8",
			ETag: catalogue.etag,
		};
		// Cloudflare weakens the ETag (W/"…") when it compresses the body, so
		// the app sends back the weak form. Compare the version either way.
		const asked = (request.headers.get("If-None-Match") ?? "").replace(/^W\//, "");
		if (asked === catalogue.etag) {
			return new Response(null, { status: 304, headers });
		}
		return new Response(request.method === "HEAD" ? null : catalogue.body, { headers });
	},
} satisfies ExportedHandler<Env>;

async function load(db: D1Database): Promise<Cached> {
	const now = Date.now();
	if (cached && now - cached.checkedAt < RECHECK_MS) return cached;

	const current = await db.prepare("SELECT value FROM meta WHERE key = 'version'").first<{ value: string }>();
	if (!current) throw new Error("No published version.");
	const etag = `"v${current.value}"`;
	if (cached && cached.etag === etag) {
		cached = { ...cached, checkedAt: now };
		return cached;
	}

	const { results } = await db
		.prepare(
			"SELECT id, person, said, said_kind, source_title, source_url, takeaway, action, axis, themes FROM lines WHERE version = ? ORDER BY id",
		)
		.bind(Number(current.value))
		.all<Row>();
	const lines = results.map((row) => ({
		id: row.id,
		person: row.person,
		said: row.said,
		kind: row.said_kind,
		source: row.source_title,
		url: row.source_url,
		takeaway: row.takeaway,
		action: row.action,
		axis: row.axis,
		themes: JSON.parse(row.themes) as string[],
	}));
	const version = Number(current.value);
	cached = { body: JSON.stringify({ version, lines }), checkedAt: now, count: lines.length, etag, version };
	return cached;
}

function error(status: number, message: string, extra: Record<string, string> = {}): Response {
	return new Response(JSON.stringify({ error: message }), {
		status,
		headers: { ...BASE_HEADERS, "Content-Type": "application/json; charset=utf-8", ...extra },
	});
}
