import { isAbsoluteUri } from "./uri";

describe("isAbsoluteUri", () => {
  it("accepte une URL http(s)", () => {
    expect(isAbsoluteUri("https://stats.oecd.org/glossary/detail.asp?ID=2288")).toBe(true);
    expect(isAbsoluteUri("http://id.insee.fr/concepts/definition/c4")).toBe(true);
  });

  it("accepte une URN", () => {
    expect(isAbsoluteUri("urn:concept:42")).toBe(true);
  });

  it("refuse une saisie sans schéma", () => {
    expect(isAbsoluteUri("stats.oecd.org/glossary")).toBe(false);
    expect(isAbsoluteUri("Commerce de gros")).toBe(false);
  });

  it("refuse une saisie vide ou réduite à des espaces", () => {
    expect(isAbsoluteUri("")).toBe(false);
    expect(isAbsoluteUri("   ")).toBe(false);
  });

  it("ignore les espaces autour de la saisie", () => {
    expect(isAbsoluteUri("  urn:concept:42  ")).toBe(true);
  });

  it("refuse un schéma sans rien derrière", () => {
    expect(isAbsoluteUri("https://")).toBe(false);
    expect(isAbsoluteUri("urn:")).toBe(false);
  });

  it("refuse une saisie contenant des espaces internes", () => {
    expect(isAbsoluteUri("urn:concept 42")).toBe(false);
  });
});
