import adapter from "@sveltejs/adapter-static";
import { vitePreprocess } from "@sveltejs/vite-plugin-svelte";
import { mdsvex, escapeSvelte } from "mdsvex";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { createHighlighter } from "shiki";

const __dirname = dirname(fileURLToPath(import.meta.url));

const shikiHighlighter = await createHighlighter({
  themes: ["github-dark"],
  langs: ["javascript", "typescript", "tsx", "svelte", "html", "bash", "json"],
});

/** @type {import('@sveltejs/kit').Config} */
const config = {
  runes: true,
  extensions: [".svelte", ".md"],
  preprocess: [
    vitePreprocess(),
    mdsvex({
      extensions: [".md"],
      smartypants: {
        ellipses: true,
        quotes: true,
        dashes: "oldschool",
      },
      layout: resolve(__dirname, "./src/lib/mdsvex/docs-layout.svelte"),
      highlight: {
        highlighter: (code, lang) => {
          const html = shikiHighlighter.codeToHtml(code, {
            lang: lang || "text",
            theme: "github-dark",
          });
          const escaped = escapeSvelte(html).replace(/`/g, "&#96;").replace(/\$/g, "&#36;");
          return `{@html \`${escaped}\`}`;
        },
      },
    }),
  ],
  kit: {
    adapter: adapter(),
    prerender: {
      // Nothing links the 404 page; it must be crawled explicitly to emit 404.html.
      entries: ["*", "/404"],
    },
  },
};

export default config;
