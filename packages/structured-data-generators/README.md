# structured-data-generators

Type-safe [schema.org](https://schema.org) structured data factories and safe JSON-LD serialization.

**Docs:** [structured-data-generators.viktorvav.workers.dev](https://structured-data-generators.viktorvav.workers.dev)

- **Literal-typed factories** — `createPersonSchema(...)["@type"]` is the literal `"Person"`, not `string`, so graphs stay correct at compile time.
- **Script-safe serializer** — `toJsonLd` escapes `<`, `>`, `&`, U+2028, and U+2029, so the output can be embedded in a `<script type="application/ld+json">` tag without breaking out of it.
- **Zero dependencies, ESM-only, framework-agnostic** — plain TypeScript; works in any runtime or framework.

## Install

```sh
npm install structured-data-generators
```

## Quick example

```ts
import { createPersonSchema, toJsonLd } from "structured-data-generators";

const person = createPersonSchema({
  "@id": "https://example.com/#person",
  name: "Ada Lovelace",
  url: "https://example.com",
  jobTitle: "Mathematician",
  sameAs: ["https://en.wikipedia.org/wiki/Ada_Lovelace"],
});

const html = `<script type="application/ld+json">${toJsonLd(person)}</script>`;
```

Pass an array to compose a multi-node `@graph`:

```ts
import { createNodeRef, createWebSiteSchema, toJsonLd } from "structured-data-generators";

const website = createWebSiteSchema({
  "@id": "https://example.com/#website",
  name: "Example",
  url: "https://example.com",
  author: person,
});

toJsonLd([website, person]);
// {"@context":"https://schema.org/","@graph":[...]}

// Reference nodes declared elsewhere instead of repeating them:
const ref = createNodeRef("https://example.com/#website");
```

## What's included

Factories for `Person`, `Organization`, `WebSite`, `WebPage`, `Article`/`BlogPosting`/`NewsArticle`, `ProfilePage`, `CollectionPage`, `ItemList`, `BreadcrumbList`, `SoftwareSourceCode`, `Place`, `Country`, `DefinedTerm`, `EmployeeRole`, and educational organization/credential types — plus the `StructuredDataSchema` union and the `toJsonLd` serializer.

Factories stamp `@type` and pass your options through verbatim: no hidden defaults, and JSON key order follows your option order (useful when snapshot-testing emitted markup).

## Notes

- `toJsonLd` returns `"{}"` (and logs the error) if the schema cannot be stringified, so a bad node never breaks the page.
- Set `inLanguage`, dates, and other locale-specific fields yourself — the factories add nothing behind your back.

## License

[MIT](./LICENSE)
