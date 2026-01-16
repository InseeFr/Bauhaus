import { Document } from "../../model/operations/document";
import { isDocument, isLink } from "./utils";

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
  it("should return false if uri undefined", () => {
    expect(isDocument({} as unknown as Document)).toBeFalsy();
  });
});

describe("isDocument", () => {
  it("should return false", () => {
    expect(isDocument({ uri: "url/page/1" } as unknown as Document)).toBeFalsy();
  });
  it("should return true", () => {
    expect(isDocument({ uri: "url/document/1" } as unknown as Document)).toBeTruthy();
  });
  it("should return false if undefined", () => {
    expect(isDocument(undefined as unknown as Document)).toBeFalsy();
  });

  it("should return false if uri undefined", () => {
    expect(isDocument({} as unknown as Document)).toBeFalsy();
  });
});
