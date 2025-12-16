import { processGeneral } from "./shared";

describe("processGeneral", () => {
  it("should process general object correctly", () => {
    const input = {
      valid: "T12:00:00.000Z",
      additionalMaterial: "http://example.com/resource",
    };
    const keys = ["valid", "additionalMaterial"];

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
    };
    const keys = ["valid", "additionalMaterial"];

    const expectedOutput = {
      valid: "T00:00:00.000Z",
      additionalMaterial: "",
    };

    const result = processGeneral(input, keys);

    expect(result).toEqual(expectedOutput);
  });
});
