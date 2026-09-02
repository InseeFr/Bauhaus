import { Sims } from "@model/Sims";

import { getParentType } from "./getParentType";

describe("getParentType", () => {
  it('should return "operation" when idOperation is defined', () => {
    const sims = {
      idOperation: "123",
      idSeries: null,
      idIndicator: null,
    } as unknown as Sims;
    const result = getParentType(sims);
    expect(result).toBe("operation");
  });

  it('should return "series" when idSeries is defined and idOperation is undefined', () => {
    const sims = {
      idOperation: null,
      idSeries: "456",
      idIndicator: null,
    } as unknown as Sims;
    const result = getParentType(sims);
    expect(result).toBe("series");
  });

  it('should return "indicator" when idIndicator is defined and idOperation and idSeries are undefined', () => {
    const sims = {
      idOperation: null,
      idSeries: null,
      idIndicator: "789",
    } as unknown as Sims;
    const result = getParentType(sims);
    expect(result).toBe("indicator");
  });

  it("should return undefined when none of the ids are defined", () => {
    const sims = {
      idOperation: null,
      idSeries: null,
      idIndicator: null,
    } as unknown as Sims;
    const result = getParentType(sims);
    expect(result).toBeUndefined();
  });

  it('should prioritize "operation" over "series" and "indicator" when all are defined', () => {
    const sims = {
      idOperation: "123",
      idSeries: "456",
      idIndicator: "789",
    } as unknown as Sims;
    const result = getParentType(sims);
    expect(result).toBe("operation");
  });

  it('should prioritize "series" over "indicator" when both are defined but idOperation is undefined', () => {
    const sims = {
      idOperation: null,
      idSeries: "456",
      idIndicator: "789",
    } as unknown as Sims;
    const result = getParentType(sims);
    expect(result).toBe("series");
  });
});
