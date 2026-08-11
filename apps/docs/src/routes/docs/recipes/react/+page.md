---
title: React & Next.js
description: Render JSON-LD with dangerouslySetInnerHTML — safe here by construction.
---

## The pattern

React treats a script tag's serialized JSON like any other content, so the string goes in via `dangerouslySetInnerHTML`. That prop name is a deliberate warning label — but `toJsonLd` output cannot contain a raw `<`, `>`, or `&`, so nothing in it can close the tag or start a new one. This is the one place the prop's danger doesn't apply:

```tsx
import { createArticleSchema, toJsonLd } from "structured-data-generators";

export function ArticleJsonLd({ post }: { post: Post }) {
  const article = createArticleSchema({
    inLanguage: "en",
    headline: post.title,
    description: post.description,
    datePublished: post.publishedAt,
    url: `https://example.com/blog/${post.slug}`,
  });

  return (
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: toJsonLd(article) }} />
  );
}
```

Google reads JSON-LD from the body as well as the head, so the script can render right where your page component lives — no head-management library required.

## Next.js App Router

Build the schema in a server component next to the data it describes, so it ships in the initial HTML that crawlers receive:

```tsx
// app/blog/[slug]/page.tsx
import {
  createArticleSchema,
  createBreadcrumbListSchema,
  toJsonLd,
} from "structured-data-generators";

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getPost(slug);

  const structuredData = [
    createArticleSchema({
      inLanguage: "en",
      headline: post.title,
      description: post.description,
      datePublished: post.publishedAt,
      url: `https://example.com/blog/${slug}`,
    }),
    createBreadcrumbListSchema([
      { name: "Home", url: "https://example.com" },
      { name: "Blog", url: "https://example.com/blog" },
      { name: post.title },
    ]),
  ];

  return (
    <article>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: toJsonLd(structuredData) }}
      />
      <h1>{post.title}</h1>
    </article>
  );
}
```

This is the same shape Next's own JSON-LD guidance recommends; the Metadata API covers titles and Open Graph tags but not structured data. In the Pages Router, the identical script element goes inside `next/head`'s `<Head>`.

## An aside on React's escaping

Rendering the JSON as a plain child (`{toJsonLd(article)}` between the tags) happens to survive React's HTML escaping — the escaper rewrites raw `<`, `>`, and `&`, and the serializer's output contains none. Don't rely on that coincidence of implementations: `dangerouslySetInnerHTML` states the intent ("this string is final markup") and is the documented pattern.
