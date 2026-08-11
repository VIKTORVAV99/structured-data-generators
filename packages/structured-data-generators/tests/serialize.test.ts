import assert from "node:assert/strict";
import { describe, it, mock } from "node:test";
import {
  createPersonSchema,
  toJsonLd,
  type PersonSchema,
  type StructuredDataSchema,
} from "structured-data-generators";

describe("toJsonLd", () => {
  it("wraps a single schema with @context first", () => {
    assert.equal(
      toJsonLd(createPersonSchema({ name: "x" })),
      '{"@context":"https://schema.org/","@type":"Person","name":"x"}',
    );
  });

  it("wraps an array as @graph", () => {
    const schemas: StructuredDataSchema[] = [
      createPersonSchema({ name: "a" }),
      createPersonSchema({ name: "b" }),
    ];
    assert.equal(
      toJsonLd(schemas),
      '{"@context":"https://schema.org/","@graph":[{"@type":"Person","name":"a"},{"@type":"Person","name":"b"}]}',
    );
  });

  it("serializes an empty array as an empty @graph", () => {
    assert.equal(toJsonLd([]), '{"@context":"https://schema.org/","@graph":[]}');
  });

  it("escapes </script> so the payload cannot close its script tag", () => {
    const out = toJsonLd(createPersonSchema({ name: "</script><script>alert(1)" }));
    assert.ok(out.includes("\\u003c/script\\u003e"));
    assert.ok(!out.includes("<"));
    assert.ok(!out.includes(">"));
  });

  it("escapes ampersands", () => {
    const out = toJsonLd(createPersonSchema({ name: "x", url: "https://example.com/?a=1&b=2" }));
    assert.ok(out.includes("https://example.com/?a=1\\u0026b=2"));
    assert.ok(!out.includes("&"));
  });

  it("escapes U+2028 and U+2029, which JSON.stringify leaves raw", () => {
    const out = toJsonLd(createPersonSchema({ name: "a\u2028b\u2029c" }));
    assert.ok(out.includes("a\\u2028b\\u2029c"));
  });

  it("emits no character that can break out of a script tag", () => {
    const out = toJsonLd(
      createPersonSchema({ name: "<&>\u2028\u2029", url: "https://example.com/?a=1&b=2" }),
    );
    assert.ok(!/[<>&\u2028\u2029]/.test(out));
  });

  it("returns {} and logs when the schema cannot be stringified", () => {
    const error = mock.method(console, "error", () => {});
    const person = createPersonSchema({ name: "x" });
    (person as { mainEntityOfPage?: unknown }).mainEntityOfPage = person;
    assert.equal(toJsonLd(person), "{}");
    assert.equal(error.mock.callCount(), 1);
    error.mock.restore();
  });

  it("escapes transparently: parsing the output restores the input", () => {
    const person: PersonSchema = createPersonSchema({
      name: "<&>\u2028\u2029",
      url: "https://example.com/?a=1&b=2",
    });
    assert.deepEqual(JSON.parse(toJsonLd(person)), {
      "@context": "https://schema.org/",
      ...person,
    });
  });
});
