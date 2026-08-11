<script lang="ts">
  import type { Snippet } from "svelte";
  import { page } from "$app/state";
  import {
    createBreadcrumbListSchema,
    createNodeRef,
    createWebPageSchema,
  } from "structured-data-generators";
  import DocsHead from "$lib/components/DocsHead.svelte";
  import { SITE_NAME, SITE_URL } from "$lib/config";
  import { sectionLabelFor } from "$lib/nav";

  let {
    title,
    description,
    children,
  }: {
    title: string;
    description: string;
    children?: Snippet;
  } = $props();

  const pageUrl = $derived(SITE_URL + page.url.pathname.replace(/\/$/, ""));
  const section = $derived(sectionLabelFor(page.url.pathname.replace(/\/$/, "")));
  const structuredData = $derived([
    createWebPageSchema({
      "@id": pageUrl,
      url: pageUrl,
      isPartOf: createNodeRef(`${SITE_URL}/#website`),
    }),
    createBreadcrumbListSchema([
      { name: SITE_NAME, url: SITE_URL },
      ...(section ? [{ name: section }] : []),
      { name: title },
    ]),
  ]);
</script>

<DocsHead title={`${title} · ${SITE_NAME}`} {description} {structuredData} />

<article class="prose">
  <h1>{title}</h1>
  <p class="-mt-2 mb-8 text-lg text-surface-400">{description}</p>
  {@render children?.()}
</article>
