// Compile-time assertions, checked by `tsc --noEmit` and never executed
// (the filename does not match the node --test glob).
import {
  createArticleSchema,
  createPersonSchema,
  createWebSiteSchema,
  toJsonLd,
  type StructuredDataSchema,
} from "structured-data-generators";

// Factories preserve the literal @type
export const personType: "Person" = createPersonSchema({ name: "x" })["@type"];
export const articleType: "Article" | "BlogPosting" | "NewsArticle" = createArticleSchema({
  headline: "h",
  datePublished: "d",
})["@type"];

// @ts-expect-error — options exclude "@type"; the factory stamps it
export const stamped = createPersonSchema({ "@type": "Person", name: "x" });

// @ts-expect-error — headline and datePublished are required
export const missingRequired = createArticleSchema({});

// Results are assignable to the serializer's input union
export const graph: StructuredDataSchema[] = [
  createPersonSchema({ name: "x" }),
  createWebSiteSchema({ name: "x", url: "https://example.com" }),
];
export const single: string = toJsonLd(graph[0]);
export const many: string = toJsonLd(graph);
