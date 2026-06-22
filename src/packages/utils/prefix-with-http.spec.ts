import { prefixWithHttp } from "./prefix-with-http";

describe("prefixWithHttp", () => {
  it("returns an empty string when input is empty", () => {
    expect(prefixWithHttp("")).toBe("");
  });

  it("leaves an http:// URL unchanged", () => {
    expect(prefixWithHttp("http://example.com")).toBe("http://example.com");
  });

  it("leaves an https:// URL unchanged", () => {
    expect(prefixWithHttp("https://example.com")).toBe("https://example.com");
  });

  it("prefixes a bare domain with http://", () => {
    expect(prefixWithHttp("example.com")).toBe("http://example.com");
  });
});
