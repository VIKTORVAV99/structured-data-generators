import type { StructuredDataSchema } from "./schemas.js";

const schemaURL = "https://schema.org/";

export const toJsonLd = (schema: StructuredDataSchema | StructuredDataSchema[]): string => {
  try {
    const payload = Array.isArray(schema)
      ? { "@context": schemaURL, "@graph": schema }
      : { "@context": schemaURL, ...schema };

    const json = JSON.stringify(payload);

    // Escape characters that can break out of an HTML <script> tag
    return json
      .replace(/</g, "\\u003c")
      .replace(/>/g, "\\u003e")
      .replace(/&/g, "\\u0026")
      .replace(/\u2028/g, "\\u2028") // Line separator
      .replace(/\u2029/g, "\\u2029"); // Paragraph separator
  } catch (error) {
    console.error("Failed to stringify JSON-LD schema:", error);
    return "{}"; // Fallback to a safe, empty JSON object
  }
};
