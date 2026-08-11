---
title: Plain HTML & SSR
description: Use the serializer anywhere you can produce a string.
---

## Template strings

`toJsonLd` returns a string that is safe to interpolate into markup, so any server or build step that produces HTML works:

```ts
import { createWebSiteSchema, toJsonLd } from "structured-data-generators";

const website = createWebSiteSchema({
  "@id": "https://example.com/#website",
  name: "Example",
  url: "https://example.com",
});

const page = `<!doctype html>
<html lang="en">
  <head>
    <title>Example</title>
    <script type="application/ld+json">${toJsonLd(website)}</script>
  </head>
  <body>
    ...
  </body>
</html>`;
```

The same shape works in an Express or Fastify handler, an edge worker, or a static-site build script — anywhere you return or write an HTML string.

## One rule

The JSON-LD string must reach the page **unescaped** — raw interpolation as above, or your template engine's raw/unsafe helper. The serializer already did the only escaping the script context needs; HTML-entity-escaping it a second time produces invalid JSON that consumers silently ignore.

## If your code itself lives in an inline script

A template literal in a `.ts`/`.js` file can contain `</script>` freely, as above. But if the assembling code is pasted into an inline `<script>` inside an HTML file, that literal `</script>` in your source ends the *surrounding* script element before the browser ever executes it. Split the closing tag in source — `"<" + "/script>"` — which is exactly what the [SvelteKit recipe](/docs/recipes/sveltekit) does inside its component, and why.
