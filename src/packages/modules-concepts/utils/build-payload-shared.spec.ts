import { ConceptGeneral } from "../../model/concepts/concept";
import { processGeneral } from "./build-payload-shared";

describe("processGeneral", () => {
  it("should process general object correctly", () => {
    const input = {
      valid: "T12:00:00.000Z",
      additionalMaterial: "http://example.com/resource",
    } as unknown as Partial<ConceptGeneral>;
    const keys: (keyof ConceptGeneral)[] = ["valid", "additionalMaterial"];

    const expectedOutput = {
      valid: "T00:00:00.000Z",
      additionalMaterial: "http://example.com/resource",
    };

    const result = processGeneral(input, keys);

    expect(result).toEqual(expectedOutput);
  });

  it("should handle missing additionalMaterial", () => {
    const input = {
      valid: "T12:00:00.000Z",
      additionalMaterial: undefined,
    } as unknown as Partial<ConceptGeneral>;
    const keys: (keyof ConceptGeneral)[] = ["valid", "additionalMaterial"];

    const expectedOutput = {
      valid: "T00:00:00.000Z",
      additionalMaterial: "",
    };

    const result = processGeneral(input, keys);

    expect(result).toEqual(expectedOutput);
  });
});
