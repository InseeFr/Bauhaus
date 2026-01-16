import { describe, it, expect } from "vitest";

import { initializeContributorProperty } from "./contributor-init";

describe("initializeContributorProperty", () => {
  it("should initialize contributor with user stamp if isContributor and isCreation are true", () => {
    const result = initializeContributorProperty(true, true, "user123");
    expect(result).toEqual({ contributor: ["user123"] });
  });

  it("should return an empty object if isContributor is false", () => {
    const result = initializeContributorProperty(false, true, "user123");
    expect(result).toEqual({});
  });

  it("should return an empty object if isCreation is false", () => {
    const result = initializeContributorProperty(true, false, "user123");
    expect(result).toEqual({});
  });

  it("should return an empty object if both isContributor and isCreation are false", () => {
    const result = initializeContributorProperty(false, false, "user123");
    expect(result).toEqual({});
  });
});
