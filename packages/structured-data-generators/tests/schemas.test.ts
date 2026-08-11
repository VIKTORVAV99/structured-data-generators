import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  createArticleSchema,
  createBreadcrumbListSchema,
  createCollectionPageRefSchema,
  createCollectionPageSchema,
  createCollegeOrUniversitySchema,
  createCountrySchema,
  createDefinedTermSchema,
  createEducationalCredentialSchema,
  createEducationalOrganizationSchema,
  createEmployeeRoleSchema,
  createHighSchoolSchema,
  createItemListSchema,
  createNodeRef,
  createOrganizationSchema,
  createPersonSchema,
  createPlaceSchema,
  createProfilePageSchema,
  createSoftwareSourceCodeSchema,
  createWebPageSchema,
  createWebSiteSchema,
} from "structured-data-generators";

describe("options-bag factories stamp their literal @type", () => {
  const person = createPersonSchema({ name: "x" });
  const list = createItemListSchema(["https://example.com/a"]);
  const cases: [{ "@type": string }, string][] = [
    [createOrganizationSchema({ name: "x" }), "Organization"],
    [createEmployeeRoleSchema({}), "EmployeeRole"],
    [createEducationalOrganizationSchema({ name: "x" }), "EducationalOrganization"],
    [createCollegeOrUniversitySchema({ name: "x" }), "CollegeOrUniversity"],
    [createHighSchoolSchema({ name: "x" }), "HighSchool"],
    [createEducationalCredentialSchema({ name: "x" }), "EducationalOccupationalCredential"],
    [createWebPageSchema({ "@id": "https://example.com/p" }), "WebPage"],
    [createSoftwareSourceCodeSchema({ name: "x" }), "SoftwareSourceCode"],
    [person, "Person"],
    [createProfilePageSchema({ mainEntity: person }), "ProfilePage"],
    [createDefinedTermSchema({ name: "x" }), "DefinedTerm"],
    [createCollectionPageSchema({ name: "x", url: "u", mainEntity: list }), "CollectionPage"],
    [createWebSiteSchema({ name: "x", url: "u" }), "WebSite"],
    [createArticleSchema({ headline: "h", datePublished: "d" }), "BlogPosting"],
  ];
  for (const [schema, expected] of cases) {
    it(`stamps ${expected}`, () => {
      assert.equal(schema["@type"], expected);
    });
  }
});

describe("positional factories", () => {
  it("createPlaceSchema nests a PostalAddress", () => {
    assert.deepEqual(createPlaceSchema("Malmö", "SE"), {
      "@type": "Place",
      address: { "@type": "PostalAddress", addressLocality: "Malmö", addressCountry: "SE" },
    });
  });

  it("createCountrySchema", () => {
    assert.deepEqual(createCountrySchema("Sweden"), { "@type": "Country", name: "Sweden" });
  });

  it("createCollectionPageRefSchema", () => {
    assert.deepEqual(createCollectionPageRefSchema("https://example.com/blog"), {
      "@type": "CollectionPage",
      url: "https://example.com/blog",
    });
  });

  it("createNodeRef", () => {
    assert.deepEqual(createNodeRef("https://example.com/#website"), {
      "@id": "https://example.com/#website",
    });
  });
});

describe("createBreadcrumbListSchema", () => {
  it("numbers positions from 1 and maps url to item", () => {
    const crumbs = createBreadcrumbListSchema([
      { name: "Home", url: "https://example.com" },
      { name: "Blog" },
    ]);
    assert.deepEqual(crumbs, {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: "https://example.com" },
        { "@type": "ListItem", position: 2, name: "Blog" },
      ],
    });
  });

  it("omits the item key entirely for entries without a url", () => {
    const crumbs = createBreadcrumbListSchema([{ name: "Here" }]);
    assert.ok(!("item" in crumbs.itemListElement[0]));
  });
});

describe("createItemListSchema", () => {
  it("counts items and numbers positions from 1", () => {
    assert.deepEqual(createItemListSchema(["https://a.test", "https://b.test"]), {
      "@type": "ItemList",
      numberOfItems: 2,
      itemListElement: [
        { "@type": "ListItem", position: 1, item: "https://a.test" },
        { "@type": "ListItem", position: 2, item: "https://b.test" },
      ],
    });
  });
});

describe("createArticleSchema @type default", () => {
  it("defaults to BlogPosting", () => {
    assert.equal(
      createArticleSchema({ headline: "h", datePublished: "d" })["@type"],
      "BlogPosting",
    );
  });

  it("an explicit @type wins", () => {
    assert.equal(
      createArticleSchema({ "@type": "Article", headline: "h", datePublished: "d" })["@type"],
      "Article",
    );
  });
});

// The factories' whole contract: stamp @type first, then the options verbatim.
// Exact strings pin both the no-injection guarantee and JSON key order, which
// consumers may byte-snapshot.
describe("factories inject nothing and preserve key order", () => {
  it("createArticleSchema", () => {
    assert.equal(
      JSON.stringify(createArticleSchema({ headline: "h", datePublished: "2026-01-01" })),
      '{"@type":"BlogPosting","headline":"h","datePublished":"2026-01-01"}',
    );
  });

  it("createArticleSchema with an explicit @type", () => {
    assert.equal(
      JSON.stringify(
        createArticleSchema({ "@type": "Article", headline: "h", datePublished: "d" }),
      ),
      '{"@type":"Article","headline":"h","datePublished":"d"}',
    );
  });

  it("createWebSiteSchema", () => {
    assert.equal(
      JSON.stringify(createWebSiteSchema({ name: "n", url: "https://example.com" })),
      '{"@type":"WebSite","name":"n","url":"https://example.com"}',
    );
  });

  it("createCollectionPageSchema", () => {
    const list = createItemListSchema(["https://example.com/a"]);
    assert.equal(
      JSON.stringify(
        createCollectionPageSchema({ name: "n", url: "https://example.com", mainEntity: list }),
      ),
      '{"@type":"CollectionPage","name":"n","url":"https://example.com","mainEntity":{"@type":"ItemList","numberOfItems":1,"itemListElement":[{"@type":"ListItem","position":1,"item":"https://example.com/a"}]}}',
    );
  });

  it("options keep their literal order: inLanguage first lands right after @type", () => {
    assert.equal(
      JSON.stringify(createArticleSchema({ inLanguage: "en", headline: "h", datePublished: "d" })),
      '{"@type":"BlogPosting","inLanguage":"en","headline":"h","datePublished":"d"}',
    );
  });
});
