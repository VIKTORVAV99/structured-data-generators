<script lang="ts">
  import type { Snippet } from "svelte";
  import { AUTHOR_NAME, AUTHOR_URL, NPM_URL, RELEASES_URL, REPO_URL, SITE_NAME } from "$lib/config";
  import "../app.css";

  let { children }: { children: Snippet } = $props();
</script>

<header
  class="sticky top-0 z-10 border-b border-surface-800 bg-surface-950/80 backdrop-blur-sm"
>
  <div class="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3">
    <a href="/" class="font-mono text-sm font-semibold text-surface-50 hover:text-accent">
      {SITE_NAME}
    </a>
    <nav class="flex items-center gap-4 text-sm text-surface-400">
      <a href="/docs/getting-started" class="hover:text-accent">Docs</a>
      <a href={NPM_URL} class="hover:text-accent">npm</a>
      <a href={REPO_URL} class="hover:text-accent">GitHub</a>
    </nav>
  </div>
</header>

<main class="mx-auto w-full max-w-6xl flex-1 px-4">
  {@render children()}
</main>

<footer class="mt-16 border-t border-surface-800">
  <div
    class="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-2 px-4 py-6 text-sm text-surface-500"
  >
    <p>
      <a href="{REPO_URL}/blob/main/LICENSE" class="hover:text-accent">MIT</a>
      · <a href={AUTHOR_URL} class="hover:text-accent">{AUTHOR_NAME}</a>
    </p>
    <p>
      <a href={RELEASES_URL} class="hover:text-accent">Changelog</a>
      · This site emits its own JSON-LD with the package — view source.
    </p>
  </div>
</footer>
