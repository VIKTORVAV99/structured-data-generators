# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Repository Overview

npm workspaces monorepo (Node ≥ 24, `.node-version` pins 26) for the `structured-data-generators` npm package:

- **packages/structured-data-generators/** — the published package: zero-dependency, ESM-only TypeScript. schema.org interfaces with literal-typed `@type`, `create*Schema` factories, and the `toJsonLd` serializer (escapes `<`, `>`, `&`, U+2028, U+2029 for safe `<script>` embedding).
- **apps/docs/** — SvelteKit documentation site (adapter-static, fully prerendered, deployed as an assets-only Cloudflare Worker). Depends on the package with a plain `"*"` range (npm has no `workspace:` protocol) and dogfoods it for its own JSON-LD.

## Commands

```sh
npm ci               # install all workspace deps
npm test             # build the package, then node --test (tests import the BUILT package by name)
npm run check:ci     # tsc --noEmit (package, includes tests/types.test-d.ts) + svelte-check (docs)
npm run build        # package (tsc -p tsconfig.build.json → dist/), then docs
npm run lint         # oxlint from the root (configs live at the root)
npm run format       # oxfmt from the root
npm run dev          # build package once, then docs dev server (docs resolve the package via dist/)
npm run deploy:docs  # wrangler deploy from apps/docs (manual; no CI deploy)
```

## Architecture constraints

- **Emitted JSON bytes are the contract.** Factories stamp `@type` first and spread options verbatim — no injected defaults, and JSON key order follows the caller's option order. Consumers byte-snapshot this output. Exact-string tests in `tests/schemas.test.ts` pin it; changing emitted bytes (key order, escaping, `@context`, adding defaults) is never a patch release.
- Package tests import `"structured-data-generators"` by name — Node self-reference resolves through the `exports` map to `dist/`, so every test run validates the exports map and the shipped artifact. That's why `npm test` builds first.
- `tests/types.test-d.ts` holds compile-time assertions; it is checked by `tsc --noEmit` and deliberately not matched by the `node --test` glob.
- The source is fully erasable TypeScript syntax so `node --test` can run `.ts` test files natively.
- The package was extracted from viktorvav99/portfolio's `$lib/seo`; the portfolio consumes it and keeps its own site-specific wrapper (`ROBOTS`, site refs, `SEO.svelte`).

## Releasing

1. Bump `version` in `packages/structured-data-generators/package.json`, commit as `release: vX.Y.Z`.
2. `git tag vX.Y.Z && git push origin main --follow-tags` — `release.yaml` publishes to npm and creates the GitHub Release (that's the changelog; no CHANGELOG file).

Publishing uses **npm OIDC trusted publishing** — there is no NPM_TOKEN secret and none must ever be created. The npmjs.com trusted-publisher config binds this repo + the workflow filename `release.yaml`; renaming that file silently breaks publishing until the npm-side config is updated. The first-ever publish (v0.1.0) was manual from a laptop because OIDC cannot create a new package; every publish after goes through the tag flow. `--provenance` stays explicit in the workflow. Versioning: during 0.x, new schemas = minor, fixes = patch, any emitted-JSON byte change = minor with a loud release note.

## Tooling

- **oxlint + oxfmt** configs at the repo root cover all workspaces; run them from the root. oxlint prints nothing when clean.
- **Test runner:** `node --test` with `node:assert/strict` (not bun:test, not vitest).
- **publint + @arethetypeswrong/cli** validate the packed tarball in CI and in `prepublishOnly`; attw needs `--profile esm-only` or it fails ESM-only packages on node10 noise.
- **svelte-check is pinned to exactly 4.7.4** (docs workspace): 4.7.5+ refuses to run with TypeScript 7 unless a dual typescript@6 + tsgo-alias setup is added. Revisit the pin when bumping to that setup deliberately.
