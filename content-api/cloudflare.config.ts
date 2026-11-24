import { bindings, defineConfig } from "cf/config";
import * as entrypoint from "./src/index.ts" with { type: "cf-worker" };

export default defineConfig({
	worker: {
		name: "north-content",
		compatibilityDate: "2026-10-06",
		entrypoint,
		workersDev: true,
		observability: { enabled: true },
		env: {
			DB: bindings.d1({ id: "fd5867e8-df74-4483-a555-8b3beb108161", name: "north-content" }),
			// Per IP: 30 requests a minute is far above what one phone needs
			// (it asks at most once a day) and low enough to blunt a scraper loop.
			LIMITER: bindings.rateLimit({ namespace: "1001", simple: { limit: 30, period: 60 } }),
		},
	},
});
