<script lang="ts">
  import {
    createPersonSchema,
    createSoftwareSourceCodeSchema,
    createWebSiteSchema,
  } from "structured-data-generators";
  import DocsHead from "$lib/components/DocsHead.svelte";
  import { NPM_URL, REPO_URL, SITE_NAME, SITE_URL } from "$lib/config";

  const DESCRIPTION =
    "Type-safe schema.org structured data factories and safe JSON-LD serialization for TypeScript.";

  const author = createPersonSchema({
    "@id": "https://viktor.andersson.tech/#person",
    name: "Viktor Andersson",
    url: "https://viktor.andersson.tech",
  });

  const structuredData = [
    createWebSiteSchema({
      "@id": `${SITE_URL}/#website`,
      name: SITE_NAME,
      url: SITE_URL,
      inLanguage: "en",
      description: DESCRIPTION,
      author,
    }),
    createSoftwareSourceCodeSchema({
      name: SITE_NAME,
      description: DESCRIPTION,
      codeRepository: REPO_URL,
      programmingLanguage: "TypeScript",
      license: `${REPO_URL}/blob/main/LICENSE`,
      author,
    }),
  ];
</script>

<DocsHead title="{SITE_NAME} — typed schema.org JSON-LD" description={DESCRIPTION} {structuredData} />

<section class="py-16 lg:py-24">
  <div class="grid items-center gap-12 lg:grid-cols-2">
    <div>
      <h1 class="text-3xl leading-tight lg:text-4xl">structured-data-<wbr />generators</h1>
      <p class="mt-4 max-w-md text-lg text-surface-300">
        Typed factories for schema.org nodes, and a serializer whose output can't break out of its
        <code class="rounded-sm bg-surface-800 px-1.5 py-0.5 font-mono text-base">&lt;script&gt;</code>
        tag.
      </p>
      <p class="mt-6 font-mono text-sm text-surface-400">
        <span class="text-surface-500 select-none">$</span> npm install structured-data-generators
      </p>
      <div class="mt-8 flex flex-wrap gap-3 text-sm">
        <a
          href="/docs/getting-started"
          class="rounded-lg bg-accent px-4 py-2 font-semibold text-surface-950 hover:bg-accent/85"
        >
          Get started
        </a>
        <a
          href={REPO_URL}
          class="rounded-lg border border-surface-700 px-4 py-2 text-surface-300 hover:border-surface-500 hover:text-surface-100"
        >
          GitHub
        </a>
        <a
          href={NPM_URL}
          class="rounded-lg border border-surface-700 px-4 py-2 text-surface-300 hover:border-surface-500 hover:text-surface-100"
        >
          npm
        </a>
      </div>
    </div>

    <figure class="min-w-0">
      <div class="overflow-hidden rounded-xl border border-surface-800 bg-surface-900">
        <div
          class="flex items-center justify-between border-b border-surface-800 px-4 py-2 font-mono text-xs text-surface-500"
        >
          <span>view-source: what your page ships</span>
          <span class="text-accent">application/ld+json</span>
        </div>
        <pre class="overflow-x-auto p-4 font-mono text-xs leading-relaxed text-surface-400"><code
            >&lt;script type="application/ld+json"&gt;
{"{"}"@context":"https://schema.org/",
 "@type":<span class="text-surface-100">"Person"</span>,
 "name":<span class="text-surface-100">"Ada Lovelace"</span>,
 "jobTitle":<span class="text-surface-100">"Analyst <mark
              class="rounded-sm bg-accent/15 px-0.5 text-accent">\u0026</mark> Metaphysician"</span>,
 "description":<span class="text-surface-100">"<mark
              class="rounded-sm bg-accent/15 px-0.5 text-accent">\u003c</mark>/script<mark
              class="rounded-sm bg-accent/15 px-0.5 text-accent">\u003e</mark> stays inside its tag"</span>{"}"}
&lt;/script&gt;</code></pre>
      </div>
      <figcaption class="mt-3 text-sm text-surface-500">
        <code class="font-mono text-surface-400">toJsonLd</code> escapes
        <code class="font-mono text-surface-400">&lt;</code>,
        <code class="font-mono text-surface-400">&gt;</code>,
        <code class="font-mono text-surface-400">&amp;</code>, U+2028, and U+2029 — untrusted
        strings can't close the tag.
      </figcaption>
    </figure>
  </div>
</section>

<section class="border-t border-surface-800 py-16">
  <h2 class="text-2xl">One minute to first schema</h2>
  <div class="mt-6 overflow-x-auto rounded-xl border border-surface-800 bg-surface-900 p-4">
    <pre class="font-mono text-sm leading-relaxed text-surface-300"><code
        ><span class="text-surface-500">// 1. create — factories stamp the literal @type</span>
<span class="text-accent">import</span> {"{"} createPersonSchema, toJsonLd {"}"} <span
          class="text-accent">from</span> <span class="text-surface-100"
          >"structured-data-generators"</span>;

<span class="text-accent">const</span> person = createPersonSchema({"{"}
  <span class="text-surface-100">"@id"</span>: <span class="text-surface-100"
          >"https://example.com/#person"</span>,
  name: <span class="text-surface-100">"Ada Lovelace"</span>,
  url: <span class="text-surface-100">"https://example.com"</span>,
{"}"});

<span class="text-surface-500">// 2. serialize — safe to interpolate into HTML</span>
<span class="text-accent">const</span> tag = <span class="text-surface-100"
          >`&lt;script type="application/ld+json"&gt;</span>${"{"}toJsonLd(person){"}"}<span
          class="text-surface-100">&lt;/script&gt;`</span>;</code></pre>
  </div>
</section>

<section class="border-t border-surface-800 py-16">
  <h2 class="text-2xl">Why this one</h2>
  <dl class="mt-8 grid gap-x-10 gap-y-8 sm:grid-cols-2">
    <div>
      <dt class="font-mono text-base font-semibold text-surface-100">Literal-typed @type</dt>
      <dd class="mt-2 text-sm leading-relaxed text-surface-400">
        <code class="font-mono">createPersonSchema(...)["@type"]</code> is the literal
        <code class="font-mono">"Person"</code>, not <code class="font-mono">string</code>. Graphs
        that reference each other stay correct at compile time.
      </dd>
    </div>
    <div>
      <dt class="font-mono text-base font-semibold text-surface-100">Script-safe serializer</dt>
      <dd class="mt-2 text-sm leading-relaxed text-surface-400">
        Raw <code class="font-mono">JSON.stringify</code> in a script tag is an injection bug
        waiting for one user-supplied string. The escaping here is tested character by character.
      </dd>
    </div>
    <div>
      <dt class="font-mono text-base font-semibold text-surface-100">No hidden defaults</dt>
      <dd class="mt-2 text-sm leading-relaxed text-surface-400">
        Factories stamp <code class="font-mono">@type</code> and pass options through verbatim.
        JSON key order follows your option order, so snapshot tests of emitted markup stay stable.
      </dd>
    </div>
    <div>
      <dt class="font-mono text-base font-semibold text-surface-100">Zero dependencies</dt>
      <dd class="mt-2 text-sm leading-relaxed text-surface-400">
        Plain ESM TypeScript. No framework coupling — this site renders its own head tags with it,
        and so does <a href="https://viktor.andersson.tech" class="text-accent hover:underline"
          >viktor.andersson.tech</a
        >.
      </dd>
    </div>
  </dl>
</section>
