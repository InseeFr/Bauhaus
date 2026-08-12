import { Sims } from "../../../../../model/Sims";
import { getParentId } from "./getParentId";

describe("getParentId", () => {
  it("should return idOperation when it is defined", () => {
    const sims = {
      idOperation: "123",
      idSeries: null,
      idIndicator: null,
    } as unknown as Sims;
    const result = getParentId(sims);
    expect(result).toBe("123");
  });

  it("should return idSeries when idOperation is undefined and idSeries is defined", () => {
    const sims = {
      idOperation: null,
      idSeries: "456",
      idIndicator: null,
    } as unknown as Sims;
    const result = getParentId(sims);
    expect(result).toBe("456");
  });

  it("should return idIndicator when idOperation and idSeries are undefined and idIndicator is defined", () => {
    const sims = {
      idOperation: null,
      idSeries: null,
      idIndicator: "789",
    } as unknown as Sims;
    const result = getParentId(sims);
    expect(result).toBe("789");
  });

  it("should return null when none of the ids are defined", () => {
    const sims = {
      idOperation: null,
      idSeries: null,
      idIndicator: null,
    } as unknown as Sims;
    const result = getParentId(sims);
    expect(result).toBeNull();
  });

  it("should prioritize idOperation over idSeries and idIndicator when all are defined", () => {
    const sims = {
      idOperation: "123",
      idSeries: "456",
      idIndicator: "789",
    } as unknown as Sims;
    const result = getParentId(sims);
    expect(result).toBe("123");
  });

  it("should prioritize idSeries over idIndicator when both are defined but idOperation is undefined", () => {
    const sims = {
      idOperation: null,
      idSeries: "456",
      idIndicator: "789",
    } as unknown as Sims;
    const result = getParentId(sims);
    expect(result).toBe("456");
  });
});
