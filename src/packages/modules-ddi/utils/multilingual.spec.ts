import { describe, it, expect } from "vitest";

import { pickLang, makeEntry, type LangString } from "./multilingual";

const entries: LangString[] = [
  { "@language": "fr-FR", "@value": "Titre FR" },
  { "@language": "en-GB", "@value": "Title EN" },
];

describe("pickLang", () => {
  it("returns the value matching the requested language tag", () => {
    expect(pickLang(entries, "fr-FR")).toBe("Titre FR");
    expect(pickLang(entries, "en-GB")).toBe("Title EN");
  });

  it("falls back to a primary subtag match when the exact tag is missing", () => {
    const subtagEntries: LangString[] = [{ "@language": "fr", "@value": "Titre FR subtag" }];
    expect(pickLang(subtagEntries, "fr-FR")).toBe("Titre FR subtag");
  });

  it("returns undefined when no entry matches", () => {
    expect(pickLang(entries, "de-DE")).toBeUndefined();
  });

  it("returns undefined when input is undefined", () => {
    expect(pickLang(undefined, "fr-FR")).toBeUndefined();
  });
});

describe("makeEntry", () => {
  it("builds a LangString with @language and @value", () => {
    expect(makeEntry("fr-FR", "Libellé")).toEqual({ "@language": "fr-FR", "@value": "Libellé" });
  });
});
