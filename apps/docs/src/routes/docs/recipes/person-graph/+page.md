---
title: Person entity graph
description: Declare one canonical Person and reference it from every page.
---

## Declare the canonical node once

Give the person a stable `@id` and declare the full node on the page that's about them — typically `/about` inside a `ProfilePage`:

```ts
const person = createPersonSchema({
  "@id": "https://example.com/#person",
  mainEntityOfPage: createNodeRef("https://example.com/about"),
  name: "Ada Lovelace",
  url: "https://example.com",
  jobTitle: "Mathematician",
  worksFor: [
    createEmployeeRoleSchema({
      roleName: "Analyst",
      startDate: "1842-01",
      worksFor: createOrganizationSchema({ name: "Analytical Engine Project" }),
    }),
  ],
  alumniOf: createCollegeOrUniversitySchema({ name: "University of London" }),
  sameAs: ["https://en.wikipedia.org/wiki/Ada_Lovelace"],
});

const profilePage = createProfilePageSchema({
  "@id": "https://example.com/about",
  url: "https://example.com/about",
  mainEntity: person,
});
```

## Reference it everywhere else

Other pages don't repeat the biography — they use a slim person carrying only the `@id` (plus `name` and `url` for consumers that don't resolve references):

```ts
const personRef = createPersonSchema({
  "@id": "https://example.com/#person",
  name: "Ada Lovelace",
  url: "https://example.com",
});

const post = createArticleSchema({
  headline: "...",
  datePublished: "...",
  author: personRef,
  publisher: personRef,
});

const website = createWebSiteSchema({
  "@id": "https://example.com/#website",
  name: "Ada Lovelace",
  url: "https://example.com",
  author: personRef,
});
```

Consumers that merge JSON-LD by `@id` — Google's knowledge graph pipeline does — connect every article, the website, and the profile page to the same entity. One biography to maintain, referenced from everywhere.

This is the exact pattern behind [viktor.andersson.tech](https://viktor.andersson.tech)'s structured data, where this package was extracted from.
