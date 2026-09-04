import { Document } from "@model/operations/document";

import { isLink } from "./isLink";

describe("isLink", () => {
  it("should return true", () => {
    expect(isLink({ uri: "url/page/1" } as unknown as Document)).toBeTruthy();
  });
  it("should return false", () => {
    expect(isLink({ uri: "url/document/1" } as unknown as Document)).toBeFalsy();
  });
  it("should return false if undefined", () => {
    expect(isLink(undefined as unknown as Document)).toBeFalsy();
  });
});
