---
title: Creative work
description: Articles, blog posts, and source code repositories.
---

## createArticleSchema

Covers `Article`, `BlogPosting`, and `NewsArticle` — the `@type` defaults to `BlogPosting` and can be overridden in the options:

```ts
const post = createArticleSchema({
  inLanguage: "en",
  headline: "Post title",
  description: "One-sentence summary",
  datePublished: "2026-07-20T00:00:00.000Z",
  dateModified: "2026-07-22T00:00:00.000Z",
  author: createNodeRef("https://example.com/#person") as PersonSchema,
  url: "https://example.com/blog/post-title",
  mainEntityOfPage: createWebPageSchema({ "@id": "https://example.com/blog/post-title" }),
  isPartOf: createNodeRef("https://example.com/#website"),
  keywords: ["typescript", "seo"],
  wordCount: 1713,
  timeRequired: "PT9M", // ISO 8601 duration
});

createArticleSchema({ "@type": "NewsArticle", headline: "...", datePublished: "..." });
```

`headline` and `datePublished` are required; everything else is optional. Dates are ISO 8601 strings — the factory does no date math.

For `author` and `publisher` you can pass a full `PersonSchema`/`OrganizationSchema`, or a slim person built with just `@id`, `name`, and `url` when the full node lives on another page (see [Person entity graph](/docs/recipes/person-graph)).

## createSoftwareSourceCodeSchema

Describes a code repository — fitting for project pages and portfolio sites.

```ts
const repo = createSoftwareSourceCodeSchema({
  name: "structured-data-generators",
  description: "Typed schema.org factories and safe JSON-LD serialization",
  codeRepository: "https://github.com/VIKTORVAV99/structured-data-generators",
  programmingLanguage: "TypeScript", // or an array
  license: "https://github.com/VIKTORVAV99/structured-data-generators/blob/main/LICENSE",
  author: person,
});
```

This page's own head contains exactly this node — view source.
