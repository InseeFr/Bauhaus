import { capitalizeFirst } from "./capitalizeFirst";

describe("capitalizeFirst", () => {
  it("should return empty string", () => {
    expect(capitalizeFirst("")).toEqual("");
  });
  it("should return the same string", () => {
    expect(capitalizeFirst("String")).toEqual("String");
  });
  it("should return capitalize string", () => {
    expect(capitalizeFirst("string")).toEqual("String");
  });
});
