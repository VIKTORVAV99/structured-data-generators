---
title: Validation
description: Confirm search engines read what you meant to say.
---

## The two validators

- **[Schema.org validator](https://validator.schema.org)** — checks that the JSON-LD parses and the properties exist on their types. Run this first; it accepts a URL or pasted markup.
- **[Google Rich Results Test](https://search.google.com/test/rich-results)** — checks eligibility for Google's rich result features specifically (articles, breadcrumbs, profile pages, …). Stricter than schema.org about required properties per feature.

Test the **deployed page by URL**, not pasted source — you want to validate what crawlers actually receive after your framework renders it.

## Spot-check from the terminal

Extract and pretty-print a page's JSON-LD without leaving the shell:

```bash
curl -s https://example.com/blog/some-post \
  | node -e '
    let html = "";
    process.stdin.on("data", (c) => (html += c));
    process.stdin.on("end", () => {
      const blocks = html.match(/<script type="application\/ld\+json">(.*?)<\/script>/gs) ?? [];
      for (const block of blocks) {
        const json = block.replace(/<\/?script[^>]*>/g, "");
        console.log(JSON.stringify(JSON.parse(json), null, 2));
      }
    });
  '
```

`JSON.parse` succeeding is itself a meaningful check — the escape sequences the serializer emits are plain JSON escapes, so anything that parses is exactly what you built.

## After deploying

Search Console's enhancement reports show how Google actually indexed your structured data over time — worth a look a few days after shipping changes. Validation proves parseability; only indexing proves pickup.
