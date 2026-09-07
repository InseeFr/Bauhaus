import { Document } from "../../model/operations/document";
import { isDocument } from "./isDocument";

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
