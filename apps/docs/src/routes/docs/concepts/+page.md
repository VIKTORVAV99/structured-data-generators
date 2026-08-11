---
title: Concepts
description: The three ideas behind the API — literal types, verbatim options, and safe serialization.
---

## Factories stamp a literal @type

Each schema interface declares its `@type` as a literal type, and each factory fills it in. You never write `"@type"` by hand, and you can't misspell it:

```ts
const org = createOrganizationSchema({ name: "Acme" });
// org["@type"] is the literal "Organization"

createPersonSchema({ "@type": "Person", name: "x" });
// type error — options exclude "@type"; the factory owns it
```

Because the literals survive, unions like `StructuredDataSchema` discriminate correctly, and passing the wrong node where a `PersonSchema` is expected fails at compile time.

## Options pass through verbatim

Factories add nothing behind your back: no default language, no derived fields. The output object is `{ "@type": ..., ...yourOptions }`, which has two consequences worth knowing:

1. **You own every value.** If you want `inLanguage: "en"`, say so at the call site.
2. **JSON key order follows your option order.** `JSON.stringify` serializes keys in insertion order, so the emitted bytes are stable and snapshot-friendly. This is a tested guarantee, not an accident.

## Identify nodes with @id, connect them with references

Give long-lived entities an `@id` — a URL you control, conventionally with a fragment:

```ts
const person = createPersonSchema({
  "@id": "https://example.com/#person",
  name: "Ada Lovelace",
});
```

Any other node can then point at it with a bare reference instead of repeating the data:

```ts
import { createNodeRef } from "structured-data-generators";

const article = createArticleSchema({
  headline: "On the Analytical Engine",
  datePublished: "1843-09-01",
  isPartOf: createNodeRef("https://example.com/#website"),
});
```

Consumers that understand JSON-LD (Google does) resolve the reference to the full node — even one declared on a different page of your site. See [Person entity graph](/docs/recipes/person-graph) for the full pattern.

## Why the serializer escapes

A `<script>` element ends at the first `</script>` sequence — including one inside a JSON string. This is fine:

```ts
JSON.stringify({ name: "Ada" });
```

until a value contains user-supplied text:

```ts
JSON.stringify({ review: "nice site </script><script>steal(document.cookie)" });
```

That closes your JSON-LD block early and hands the browser a live script tag. `toJsonLd` escapes `<`, `>`, and `&` to `\u003c`, `\u003e`, `\u0026` — valid JSON escapes that parse back to the same characters but can never terminate the element. It also escapes U+2028/U+2029, which are legal in JSON but historically broke JavaScript string contexts.

The escaping is transparent: `JSON.parse(toJsonLd(x))` deep-equals `{ "@context": "https://schema.org/", ...x }`.
