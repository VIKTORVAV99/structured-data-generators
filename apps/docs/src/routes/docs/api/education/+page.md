---
title: Education
description: Schools, universities, credentials, and defined terms.
---

## Educational organizations

Three factories with the same shape, differing only in `@type` — pick the most specific one:

```ts
const university = createCollegeOrUniversitySchema({
  name: "Halmstad University",
  url: "https://www.hh.se",
  location: createPlaceSchema("Halmstad", "SE"),
  sameAs: ["https://www.wikidata.org/wiki/Q502842"],
});

const school = createHighSchoolSchema({ name: "Haganässkolan" });
const generic = createEducationalOrganizationSchema({ name: "Some academy" });
```

Use them as a person's `alumniOf` or a credential's `recognizedBy`.

## createEducationalCredentialSchema

A degree, diploma, or certificate (`EducationalOccupationalCredential`):

```ts
const degree = createEducationalCredentialSchema({
  name: "Bachelor of Science in Digital Design and Innovation",
  credentialCategory: createDefinedTermSchema({ name: "Degree", termCode: "BSc" }),
  educationalLevel: "Bachelor",
  datePublished: "2025-06",
  recognizedBy: university,
});
```

Attach one or more to a person via `hasCredential`.

## createDefinedTermSchema

A named term with an optional code — used above for the credential category, and usable anywhere schema.org expects a `DefinedTerm` (a tag page's `about`, for example):

```ts
createDefinedTermSchema({ name: "TypeScript", termCode: "ts" });
```
