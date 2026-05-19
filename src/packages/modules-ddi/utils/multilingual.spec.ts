import { describe, it, expect } from "vitest";
import { pickLang, type MultilingualStringEntry } from "./multilingual";

const entries: MultilingualStringEntry[] = [
  { MultilingualStringValue: { LanguageTag: "fr-FR", Value: "Titre FR" } },
  { MultilingualStringValue: { LanguageTag: "en-GB", Value: "Title EN" } },
];

describe("pickLang", () => {
  it("returns the value matching the requested language tag", () => {
    expect(pickLang(entries, "fr-FR")).toBe("Titre FR");
    expect(pickLang(entries, "en-GB")).toBe("Title EN");
  });

  it("falls back to a primary subtag match when the exact tag is missing", () => {
    const subtagEntries: MultilingualStringEntry[] = [
      { MultilingualStringValue: { LanguageTag: "fr", Value: "Titre FR subtag" } },
    ];
    expect(pickLang(subtagEntries, "fr-FR")).toBe("Titre FR subtag");
  });

  it("returns undefined when no entry matches", () => {
    expect(pickLang(entries, "de-DE")).toBeUndefined();
  });

  it("returns undefined when input is undefined", () => {
    expect(pickLang(undefined, "fr-FR")).toBeUndefined();
  });
});
