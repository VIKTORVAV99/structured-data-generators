# structured-data-generators

[![CI](https://github.com/VIKTORVAV99/structured-data-generators/actions/workflows/ci.yaml/badge.svg)](https://github.com/VIKTORVAV99/structured-data-generators/actions/workflows/ci.yaml)
[![npm](https://img.shields.io/npm/v/structured-data-generators)](https://www.npmjs.com/package/structured-data-generators)

Type-safe schema.org structured data factories and safe JSON-LD serialization for TypeScript.

This is the development monorepo. For usage, see the
[docs site](https://structured-data-generators.viktorvav.workers.dev) or the
[package README](packages/structured-data-generators/README.md) — the same document shown on
[npm](https://www.npmjs.com/package/structured-data-generators).

## Workspaces

- **[packages/structured-data-generators](packages/structured-data-generators)** — the published package: zero-dependency, ESM-only TypeScript
- **[apps/docs](apps/docs)** — documentation site (SvelteKit, prerendered, deployed to Cloudflare Workers); consumes the package as its own head-tag source

## Commands

```sh
npm ci               # install all workspace deps
npm test             # build the package and run its node --test suite
npm run check:ci     # tsc --noEmit (package) + svelte-check (docs)
npm run build        # build package, then docs (docs build doubles as an integration test)
npm run lint         # oxlint across the repo
npm run format       # oxfmt across the repo
npm run dev          # build package, start the docs dev server
npm run deploy:docs  # wrangler deploy the docs site
```

## Releasing

1. Bump `version` in `packages/structured-data-generators/package.json`, commit as `release: vX.Y.Z`.
2. `git tag vX.Y.Z && git push origin main --follow-tags`

The `release.yaml` workflow verifies the tag matches the manifest, runs the test and packaging
gates, publishes to npm via OIDC trusted publishing (with provenance), and creates a GitHub
Release with generated notes. GitHub Releases are the changelog.

## License

[MIT](LICENSE)
