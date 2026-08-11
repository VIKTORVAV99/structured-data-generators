---
title: Getting started
description: Install the package, build your first schema, and put it in your page's head.
---

## Install

```bash
npm install structured-data-generators
```

ESM-only, zero dependencies, plain TypeScript — it runs anywhere JavaScript does (Node, Bun, workers, browsers, any bundler).

## Build a schema

Every factory takes the schema's properties and stamps the right `@type` for you. The return type keeps `@type` as a literal, so anything you compose stays checked end to end.

```ts
import { createPersonSchema } from "structured-data-generators";

const person = createPersonSchema({
  "@id": "https://example.com/#person",
  name: "Ada Lovelace",
  url: "https://example.com",
  jobTitle: "Mathematician",
  sameAs: ["https://en.wikipedia.org/wiki/Ada_Lovelace"],
});

person["@type"]; // typed as the literal "Person"
```

## Serialize it

`toJsonLd` wraps the schema with `"@context": "https://schema.org/"` and escapes every character that could break out of a `<script>` tag. Interpolating the result into HTML is safe by construction.

```ts
import { toJsonLd } from "structured-data-generators";

const html = `<script type="application/ld+json">${toJsonLd(person)}</script>`;
```

Pass an array instead of a single schema and the nodes are wrapped in a `@graph` — see [Multi-node @graph](/docs/recipes/graph).

## Put it in the head

How the string reaches your `<head>` depends on your stack:

- [SvelteKit](/docs/recipes/sveltekit) — `<svelte:head>` and the `{@html}` assembly
- [Plain HTML & SSR](/docs/recipes/plain-html) — template strings, Hono, or any server renderer

## Check your work

Paste a rendered page into the [validation tools](/docs/validation) to confirm search engines read what you meant to say.
