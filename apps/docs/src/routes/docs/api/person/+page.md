---
title: Person
description: Person nodes, profile pages, and employment roles.
---

## createPersonSchema

The richest node in the package. Everything except `name` is optional — start slim and grow it.

```ts
const person = createPersonSchema({
  "@id": "https://example.com/#person",
  name: "Ada Lovelace",
  givenName: "Ada",
  familyName: "Lovelace",
  url: "https://example.com",
  image: "https://example.com/portrait.jpg",
  jobTitle: "Mathematician",
  description: "Wrote the first published algorithm.",
  homeLocation: createPlaceSchema("London", "GB"),
  birthPlace: createCountrySchema("England"),
  knowsLanguage: ["English", "French"],
  knowsAbout: ["Mathematics", "Analytical Engine"],
  sameAs: ["https://en.wikipedia.org/wiki/Ada_Lovelace"],
});
```

`sameAs` is how you tie the node to the rest of the web — social profiles, Wikipedia/Wikidata, anywhere that is unambiguously the same person.

Employment and education hang off the person:

- `worksFor` — `OrganizationSchema`, `EmployeeRoleSchema`, or an array mixing both
- `alumniOf` — educational organizations (see [Education](/docs/api/education))
- `hasCredential` — one or more `EducationalCredentialSchema`

## createEmployeeRoleSchema

A dated role wrapping the employer, so work history carries start/end dates:

```ts
const role = createEmployeeRoleSchema({
  roleName: "Software Engineer",
  startDate: "2025-07",
  worksFor: createOrganizationSchema({ name: "Electricity Maps" }),
});
// endDate omitted = current role
```

## createProfilePageSchema

An about/profile page whose `mainEntity` is the person. Google's profile page rich result reads this shape.

```ts
const profile = createProfilePageSchema({
  "@id": "https://example.com/about",
  url: "https://example.com/about",
  isPartOf: createNodeRef("https://example.com/#website"),
  dateCreated: "2026-03-20T00:00:00.000Z",
  dateModified: "2026-07-29T00:00:00.000Z",
  mainEntity: person,
});
```
