---
title: Breadcrumbs
description: A BreadcrumbList per route, derived from data you already have.
---

## The shape

Pass the trail in order; the factory numbers positions from 1 and turns `url` into the `item` property. The current page goes last, without a `url` — an entry with no `url` gets no `item` key at all, which is exactly what Google's breadcrumb documentation asks for.

```ts
import { createBreadcrumbListSchema } from "structured-data-generators";

const crumbs = createBreadcrumbListSchema([
  { name: "Home", url: "https://example.com" },
  { name: "Blog", url: "https://example.com/blog" },
  { name: "The post title" },
]);
```

## Derive, don't hand-write

Breadcrumbs mirror your routing, so derive them from route data instead of maintaining them per page. A blog post knows its section; a tag page knows its tag:

```ts
const postCrumbs = (post: { title: string }) =>
  createBreadcrumbListSchema([
    { name: "Home", url: SITE_URL },
    { name: "Blog", url: `${SITE_URL}/blog` },
    { name: post.title },
  ]);

const tagCrumbs = (tag: string) =>
  createBreadcrumbListSchema([
    { name: "Home", url: SITE_URL },
    { name: "Blog", url: `${SITE_URL}/blog` },
    { name: `#${tag}` },
  ]);
```

Ship the breadcrumb list alongside the page's main node as an array — see [Multi-node @graph](/docs/recipes/graph). This site derives its own breadcrumbs from the sidebar navigation data; check any docs page's source.
