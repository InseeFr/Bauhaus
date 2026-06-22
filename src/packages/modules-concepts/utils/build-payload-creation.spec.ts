import { describe, it, expect } from "vitest";

import buildPayloadCreation from "./build-payload-creation";
import { emptyWithContributor } from "./general";
import type { ConceptGeneral, ConceptNotes } from "../../model/concepts/concept";

describe("buildPayloadCreation", () => {
  it("sends `collections` as an array (not an empty string) when no collection is associated", () => {
    const general = emptyWithContributor("http://contrib") as unknown as ConceptGeneral;

    const payload = buildPayloadCreation({
      general,
      notes: {} as ConceptNotes,
      conceptsWithLinks: [],
    }) as Record<string, unknown>;

    expect(Array.isArray(payload.collections)).toBe(true);
    expect(payload.collections).toEqual([]);
  });
});
