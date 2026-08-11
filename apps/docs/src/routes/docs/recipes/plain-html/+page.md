---
title: Plain HTML & SSR
description: Use the serializer anywhere you can produce a string.
---

## Template strings

`toJsonLd` returns a string that is safe to interpolate into markup, so any server renderer works:

```ts
import { createWebSiteSchema, toJsonLd } from "structured-data-generators";

const website = createWebSiteSchema({
  name: "Example",
  url: "https://example.com",
});

const head = `
  <title>Example</title>
  <script type="application/ld+json">${toJsonLd(website)}</script>
`;
```

## Hono

```ts
import { Hono } from "hono";
import { html } from "hono/html";
import { createOrganizationSchema, toJsonLd } from "structured-data-generators";

const app = new Hono();

app.get("/", (c) => {
  const org = createOrganizationSchema({ name: "Acme", url: "https://acme.example" });
  return c.html(
    html`<!doctype html>
      <html>
        <head>
          <script type="application/ld+json">
            ${html([toJsonLd(org)] as never)}
          </script>
        </head>
        <body>
          ...
        </body>
      </html>`,
  );
});
```

The one rule everywhere: the JSON-LD string must reach the page **unescaped** (raw interpolation, `dangerouslySetInnerHTML`, `{@html}`, …). The serializer already did the only escaping the script context needs — HTML-entity-escaping it a second time produces invalid JSON.
