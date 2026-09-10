import { Sims } from "@model/Sims";

import { getParentUri } from "./getParentUri";

describe("getParentUri", () => {
  it("should return a uri of an operation", () => {
    expect(getParentUri({ idOperation: "1" } as unknown as Sims)).toBe(`/operations/operation/1`);
  });
  it("should return a uri of an series", () => {
    expect(getParentUri({ idSeries: "1" } as unknown as Sims)).toBe(`/operations/series/1`);
  });
  it("should return a uri of an indicator", () => {
    expect(getParentUri({ idIndicator: "1" } as unknown as Sims)).toBe(`/operations/indicator/1`);
  });
  it("should return undefined", () => {
    expect(getParentUri({} as unknown as Sims)).toBeUndefined();
  });
});
