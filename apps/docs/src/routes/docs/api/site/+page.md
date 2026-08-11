---
title: Site & navigation
description: WebSite, WebPage, CollectionPage, ItemList, BreadcrumbList, and node references.
---

## createWebSiteSchema

The site-level node, usually declared once (commonly on the home page) with an `@id` other pages can reference.

```ts
const website = createWebSiteSchema({
  "@id": "https://example.com/#website",
  name: "Example",
  url: "https://example.com",
  inLanguage: "en",
  description: "What the site is about",
  author: person, // PersonSchema or OrganizationSchema
});
```

## createWebPageSchema

A page node, mostly useful as `mainEntityOfPage` or to anchor breadcrumbs. `@id` is required.

```ts
const page = createWebPageSchema({
  "@id": "https://example.com/contact",
  url: "https://example.com/contact",
  isPartOf: createNodeRef("https://example.com/#website"),
});
```

## createCollectionPageSchema

A listing page — a blog index, a tag page, search results. `mainEntity` is an `ItemList` of what the page lists.

```ts
const listing = createCollectionPageSchema({
  inLanguage: "en",
  name: "Blog",
  description: "All posts",
  url: "https://example.com/blog",
  mainEntity: createItemListSchema(postUrls),
  isPartOf: createNodeRef("https://example.com/#website"),
});
```

`isPartOf` also accepts a `CollectionPageRefSchema` (or an array mixing both) — useful when a paginated or filtered listing belongs to a parent listing:

```ts
createCollectionPageRefSchema("https://example.com/blog");
// { "@type": "CollectionPage", url: "https://example.com/blog" }
```

## createItemListSchema

Takes the item URLs and handles `position` numbering (1-based) and `numberOfItems` for you.

```ts
createItemListSchema(["https://example.com/blog/a", "https://example.com/blog/b"]);
```

## createBreadcrumbListSchema

Takes `{ name, url? }` pairs in order. Leave `url` off the last crumb — the current page shouldn't link to itself. See the [breadcrumbs recipe](/docs/recipes/breadcrumbs).

```ts
createBreadcrumbListSchema([
  { name: "Home", url: "https://example.com" },
  { name: "Blog", url: "https://example.com/blog" },
  { name: "Current post" },
]);
```

## createNodeRef

A bare `{ "@id": ... }` reference to a node declared elsewhere — the glue of multi-node graphs.

```ts
createNodeRef("https://example.com/#website");
```
