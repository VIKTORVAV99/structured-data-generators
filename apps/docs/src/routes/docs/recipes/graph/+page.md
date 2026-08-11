---
title: Multi-node @graph
description: Ship several related nodes in one script tag.
---

## Arrays become @graph

A page usually has more than one thing to say — the page's main entity plus breadcrumbs is the common pair. Pass an array and `toJsonLd` wraps it:

```ts
toJsonLd([article, breadcrumbs]);
// {"@context":"https://schema.org/","@graph":[{...},{...}]}
```

One script tag with a `@graph` and separate script tags per node are both valid; the graph form keeps related nodes together and the page's head tidy.

## A home page graph

The home page is a natural place to declare site-wide nodes — the `WebSite`, the owner, and (for a code-centric site) the repository:

```ts
const person = createPersonSchema({
  "@id": "https://example.com/#person",
  name: "Ada Lovelace",
  url: "https://example.com",
});

const website = createWebSiteSchema({
  "@id": "https://example.com/#website",
  name: "Ada Lovelace",
  url: "https://example.com",
  inLanguage: "en",
  author: person,
  publisher: person,
});

const repo = createSoftwareSourceCodeSchema({
  name: "example-site",
  codeRepository: "https://github.com/ada/example-site",
  programmingLanguage: "TypeScript",
  author: person,
});

toJsonLd([website, person, repo]);
```

## Cross-page references

Nodes declared in one page's graph can be referenced from any other page by `@id`:

```ts
// On /blog/some-post — no need to redeclare the website node:
const post = createArticleSchema({
  headline: "...",
  datePublished: "...",
  isPartOf: createNodeRef("https://example.com/#website"),
});
```

Keep `@id` values boring and stable: your canonical origin plus a short fragment (`#person`, `#website`). They're identifiers, not links — but making them resolvable URLs on your own domain is good practice.
