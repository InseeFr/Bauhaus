import en from "./locales/en.json";
import fr from "./locales/fr.json";

const CONSTANT_NAME = /^[A-Z0-9_]+$/;

const errorTranslations = (catalogue: { errors: Record<string, unknown> }) =>
  Object.entries(catalogue.errors).filter(
    (entry): entry is [string, string] => typeof entry[1] === "string",
  );

describe.each([
  ["fr", fr],
  ["en", en],
])("catalogue global des erreurs (%s)", (_lang, catalogue) => {
  it("traduit chaque code par une phrase, jamais par le nom de sa constante", () => {
    const placeholders = errorTranslations(catalogue).filter(([, text]) =>
      CONSTANT_NAME.test(text),
    );

    expect(placeholders).toEqual([]);
  });
});

describe("refus de supprimer un objet publié", () => {
  it("parle de structure, et non de liste de codes, pour une structure publiée", () => {
    expect(fr.errors["1009"]).toBe(
      "La structure n'a pas pu être supprimée : elle a déjà été publiée.",
    );
    expect(en.errors["1009"]).toBe("The structure could not be removed: it is already published.");
  });
});
