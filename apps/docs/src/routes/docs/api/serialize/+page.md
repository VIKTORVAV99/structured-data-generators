---
title: toJsonLd
description: Serialize one schema or an array of schemas into a script-safe JSON-LD string.
---

```ts
const toJsonLd = (schema: StructuredDataSchema | StructuredDataSchema[]) => string;
```

## Behavior

A single schema is spread into the context object:

```ts
toJsonLd(createPersonSchema({ name: "Ada" }));
// {"@context":"https://schema.org/","@type":"Person","name":"Ada"}
```

An array becomes a `@graph`:

```ts
toJsonLd([website, person]);
// {"@context":"https://schema.org/","@graph":[{...},{...}]}
```

The `@context` is always `https://schema.org/`.

## Escaping

Applied after `JSON.stringify`, so the output is still valid JSON that parses back to the input:

| Character | Emitted  | Why                                                     |
| --------- | -------- | ------------------------------------------------------- |
| `<`       | `\u003c` | `</script>` inside a value would end the script element |
| `>`       | `\u003e` | Defense in depth alongside `<`                          |
| `&`       | `\u0026` | Prevents entity interpretation in non-script contexts   |
| U+2028    | `\u2028` | Legal in JSON, breaks legacy JavaScript string contexts |
| U+2029    | `\u2029` | Same as U+2028                                          |

## Failure mode

If the schema can't be stringified (for example, a circular reference), `toJsonLd` logs the error with `console.error` and returns `"{}"` — a harmless empty object, so a bad node degrades to "no structured data" instead of broken markup or a crashed render.

```ts
const person = createPersonSchema({ name: "Ada" });
person.mainEntityOfPage = person as never; // cycle
toJsonLd(person); // "{}" (and one console.error)
```
