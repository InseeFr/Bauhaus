import { validate } from "./validation";

vi.mock("i18next", () => ({
  default: {
    t: (key: string, options?: { lng?: string }) => {
      const translations: Record<string, Record<string, string>> = {
        fr: {
          "partial-codelists.identifier": "Identifiant",
          "partial-codelists.invalidCharactersError":
            "La valeur renseignée dans ce champ contient des caractères invalides",
          "partial-codelists.parentCodelist": "Liste de codes parent",
          "partial-codelists.label": "Libellé",
          "partial-codelists.creator": "Propriétaire",
          "partial-codelists.disseminationStatus": "Statut de diffusion",
        },
        en: {
          "partial-codelists.label": "Label",
        },
      };
      const lng = options?.lng || "fr";
      return translations[lng]?.[key] || key;
    },
  },
}));

describe("validate", () => {
  it("should return errors for missing mandatory fields", () => {
    const codelist = {};

    const result = validate(codelist);

    expect(result.errorMessage).toContain("The property <strong>Identifiant</strong> is required.");
    expect(result.errorMessage).toContain(
      "The property <strong>Liste de codes parent</strong> is required.",
    );
    expect(result.errorMessage).toContain("The property <strong>Libellé</strong> is required.");
    expect(result.errorMessage).toContain("The property <strong>Label</strong> is required.");
    expect(result.errorMessage).toContain(
      "The property <strong>Propriétaire</strong> is required.",
    );
    expect(result.errorMessage).toContain(
      "The property <strong>Statut de diffusion</strong> is required.",
    );
    expect(result.fields.id).toBe("The property <strong>Identifiant</strong> is required.");
    expect(result.fields.parentCode).toBe(
      "The property <strong>Liste de codes parent</strong> is required.",
    );
    expect(result.fields.labelLg1).toBe("The property <strong>Libellé</strong> is required.");
    expect(result.fields.labelLg2).toBe("The property <strong>Label</strong> is required.");
    expect(result.fields.creator).toBe("The property <strong>Propriétaire</strong> is required.");
    expect(result.fields.disseminationStatus).toBe(
      "The property <strong>Statut de diffusion</strong> is required.",
    );
  });

  it("should return error for invalid id characters", () => {
    const codelist = {
      id: "invalid id!",
      parentCode: "parentCode",
      labelLg1: "labelLg1",
      labelLg2: "labelLg2",
      creator: "creator",
      disseminationStatus: "status",
    };

    const result = validate(codelist);

    expect(result.errorMessage).toContain(
      "La valeur renseignée dans ce champ contient des caractères invalides",
    );
    expect(result.fields.id).toBe(
      "La valeur renseignée dans ce champ contient des caractères invalides",
    );
  });

  it("should pass validation for valid codelist", () => {
    const codelist = {
      id: "valid_id_123",
      parentCode: "parentCode",
      labelLg1: "labelLg1",
      labelLg2: "labelLg2",
      creator: "creator",
      disseminationStatus: "status",
    };

    const result = validate(codelist);

    expect(result.errorMessage).toHaveLength(0);
    expect(result.fields).toEqual({
      creator: "",
      disseminationStatus: "",
      id: "",
      labelLg1: "",
      labelLg2: "",
      parentCode: "",
    });
  });
});
