<script lang="ts">
  import type { Snippet } from "svelte";
  import { page } from "$app/state";
  import { NAV } from "$lib/nav";

  let { children }: { children: Snippet } = $props();

  const isActive = (path: string) => page.url.pathname.replace(/\/$/, "") === path;
</script>

{#snippet navLinks()}
  {#each NAV as section (section.label)}
    <div class="mb-6">
      <p class="mb-2 font-mono text-xs tracking-widest text-surface-500 uppercase">
        {section.label}
      </p>
      <ul class="space-y-1.5 text-sm">
        {#each section.links as link (link.path)}
          <li>
            <a
              href={link.path}
              aria-current={isActive(link.path) ? "page" : undefined}
              class="block hover:text-accent {isActive(link.path)
                ? 'text-accent'
                : 'text-surface-300'}"
            >
              {link.title}
            </a>
          </li>
        {/each}
      </ul>
    </div>
  {/each}
{/snippet}

<div class="gap-10 py-10 lg:grid lg:grid-cols-[13rem_minmax(0,1fr)]">
  <details class="mb-8 rounded-lg border border-surface-800 p-4 lg:hidden">
    <summary class="cursor-pointer font-mono text-sm text-surface-300">Menu</summary>
    <nav class="mt-4">{@render navLinks()}</nav>
  </details>

  <aside class="hidden lg:block">
    <nav class="sticky top-20 max-h-[calc(100dvh-6rem)] overflow-y-auto pr-2">
      {@render navLinks()}
    </nav>
  </aside>

  <div class="min-w-0 max-w-3xl">
    {@render children()}
  </div>
</div>
