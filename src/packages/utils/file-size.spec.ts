import { formatFileSize } from "./file-size";

/** Intl sépare nombre et unité par une espace insécable (fine en français) : on la normalise. */
const withPlainSpaces = (text: string) => text.replace(/[  ]/g, " ");

describe("formatFileSize", () => {
  it.each([
    [0, "0 o"],
    [512, "512 o"],
    [1000, "1 ko"],
    [130048, "130 ko"],
    [999949, "999,9 ko"],
    [999999, "1 Mo"],
    [1234567, "1,2 Mo"],
    [3400000000, "3,4 Go"],
    [5000000000000, "5 To"],
  ])("should write %i bytes as %s in French", (bytes, expected) => {
    expect(withPlainSpaces(formatFileSize(bytes, "fr").short)).toBe(expected);
  });

  it("should never let the number and the unit be split across two lines", () => {
    expect(formatFileSize(130048, "fr").short).not.toContain(" ");
  });

  it("should use the English units in English", () => {
    expect(withPlainSpaces(formatFileSize(1234567, "en").short)).toBe("1.2 MB");
  });

  it("should spell the unit out for screen readers", () => {
    expect(withPlainSpaces(formatFileSize(130048, "fr").long)).toBe("130 kilooctets");
  });
});
