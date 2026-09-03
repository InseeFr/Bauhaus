import { languageName } from "./language-name";

describe("language-name", () => {
  it("nomme la langue dans la langue de l'interface", () => {
    expect(languageName("fr", "fr")).toBe("Français");
    expect(languageName("en", "fr")).toBe("Anglais");
  });

  it("nomme la langue en anglais quand l'interface est en anglais", () => {
    expect(languageName("fr", "en")).toBe("French");
    expect(languageName("en", "en")).toBe("English");
  });

  it("accepte un code régional", () => {
    expect(languageName("fr-FR", "fr")).toBe("Français (France)");
  });

  it("garde le code tel quel quand il ne désigne aucune langue connue", () => {
    expect(languageName("lg2", "fr")).toBe("lg2");
    expect(languageName("", "fr")).toBe("");
  });
});
