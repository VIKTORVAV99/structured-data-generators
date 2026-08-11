<script lang="ts">
  import { page } from "$app/state";
  import { toJsonLd, type StructuredDataSchema } from "structured-data-generators";
  import { SITE_NAME, SITE_URL } from "$lib/config";

  let {
    title,
    description,
    structuredData,
    noindex = false,
  }: {
    title: string;
    description: string;
    structuredData?: StructuredDataSchema | StructuredDataSchema[];
    noindex?: boolean;
  } = $props();

  const canonical = $derived(SITE_URL + page.url.pathname.replace(/\/$/, ""));
</script>

<svelte:head>
  <title>{title}</title>
  <meta name="description" content={description} />

  {#if noindex}
    <meta name="robots" content="noindex, nofollow" />
  {:else}
    <link rel="canonical" href={canonical} />
    <meta property="og:url" content={canonical} />
  {/if}

  {#if structuredData}
    {@html `<script type="application/ld+json">${toJsonLd(structuredData)}<` + `/script>`}
  {/if}

  <meta property="og:site_name" content={SITE_NAME} />
  <meta property="og:type" content="website" />
  <meta property="og:title" content={title} />
  <meta property="og:description" content={description} />
  <meta name="twitter:card" content="summary" />
  <meta name="twitter:title" content={title} />
  <meta name="twitter:description" content={description} />
</svelte:head>
