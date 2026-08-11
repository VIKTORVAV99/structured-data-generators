---
title: SvelteKit
description: Build schemas in load functions and render them through svelte:head.
---

## Build the schema where the data lives

Schemas are plain data — build them in `+page.server.ts` (or `+page.ts`) next to the content they describe, and pass them through `data`:

```ts
// +page.server.ts
import { createArticleSchema, createBreadcrumbListSchema } from "structured-data-generators";

export const load = ({ params }) => {
  const post = getPost(params.slug);
  return {
    post,
    structuredData: [
      createArticleSchema({
        inLanguage: "en",
        headline: post.title,
        description: post.description,
        datePublished: post.date,
        url: `https://example.com/blog/${params.slug}`,
      }),
      createBreadcrumbListSchema([
        { name: "Home", url: "https://example.com" },
        { name: "Blog", url: "https://example.com/blog" },
        { name: post.title },
      ]),
    ],
  };
};
```

This works with prerendering: the load runs at build time and the JSON-LD lands in the static HTML crawlers receive.

## Render it in the head

Svelte escapes text content, which would mangle JSON — so the script tag goes through `{@html}`. Two things make this safe and valid:

1. `toJsonLd` output can't contain `</script>` (or any raw `<`), so the interpolation can't break out.
2. The closing tag is split (`` `<` + `/script>` ``) so the Svelte compiler doesn't mistake it for the end of the component's own script block.

```svelte
<script lang="ts">
  import { toJsonLd } from "structured-data-generators";

  let { data } = $props();
</script>

<svelte:head>
  {@html `<script type="application/ld+json">${toJsonLd(data.structuredData)}<` + `/script>`}
</svelte:head>
```

## Wrap it once

Most sites put that `{@html}` line in a small `SEO.svelte`/`Head.svelte` component together with title, description, canonical, and Open Graph tags, and give every page one head component. [viktor.andersson.tech](https://viktor.andersson.tech) and this docs site both follow that pattern.
