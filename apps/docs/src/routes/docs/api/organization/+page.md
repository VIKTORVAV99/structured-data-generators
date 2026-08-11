---
title: Organization
description: Organizations, places, and countries.
---

## createOrganizationSchema

```ts
const org = createOrganizationSchema({
  name: "Electricity Maps",
  url: "https://www.electricitymaps.com",
  description: "Electricity grid data platform",
  location: createPlaceSchema("Copenhagen", "DK"),
  sameAs: [
    "https://www.wikidata.org/wiki/Q109023297",
    "https://www.linkedin.com/company/electricitymaps/",
  ],
});
```

`location` accepts a plain string or a `PlaceSchema`; prefer the structured form. `sameAs` with a Wikidata entry is the strongest disambiguation signal you can send.

## createPlaceSchema

Positional arguments — locality and country code — because that's all a postal-address place usually needs:

```ts
createPlaceSchema("Malmö", "SE");
// { "@type": "Place", address: { "@type": "PostalAddress",
//   addressLocality: "Malmö", addressCountry: "SE" } }
```

## createCountrySchema

For fields like `birthPlace` where a country is the right granularity:

```ts
createCountrySchema("Sweden");
// { "@type": "Country", name: "Sweden" }
```
