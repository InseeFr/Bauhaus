import { getParentIdName } from "./getParentIdName";

describe("getParentIdName", () => {
  it('should return "idOperation" when parentType is "operation"', () => {
    const result = getParentIdName("operation");
    expect(result).toBe("idOperation");
  });

  it('should return "idSeries" when parentType is "series"', () => {
    const result = getParentIdName("series");
    expect(result).toBe("idSeries");
  });

  it('should return "idIndicator" when parentType is "indicator"', () => {
    const result = getParentIdName("indicator");
    expect(result).toBe("idIndicator");
  });

  it("should return undefined for invalid parentType", () => {
    const result = getParentIdName("unknown" as any); // Casté pour tester les cas non pris en charge
    expect(result).toBeUndefined();
  });
});
