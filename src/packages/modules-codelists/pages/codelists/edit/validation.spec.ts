import { validate } from "./validation";

vi.mock("i18next", () => ({
  default: {
    t: (key: string, options?: { lng?: string }) => {
      const translations: Record<string, Record<string, string>> = {
        fr: {
          "codelists.codelistURI": "URI souhaité pour la liste de codes",
          "codelists.codesURI": "Modèle souhaité pour les URI des codes",
          "codelists.classURI": "URI du concept associé",
          "codelists.identifier": "Identifiant",
          "codelists.label": "Libellé",
          "codelists.creator": "Propriétaire",
          "codelists.disseminationStatus": "Statut de diffusion",
        },
        en: {
          "codelists.label": "Label",
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

    expect(result.errorMessage).toContain(
      "The property <strong>URI souhaité pour la liste de codes</strong> is required.",
    );
    expect(result.errorMessage).toContain(
      "The property <strong>Modèle souhaité pour les URI des codes</strong> is required.",
    );
    expect(result.errorMessage).toContain(
      "The property <strong>URI du concept associé</strong> is required.",
    );
    expect(result.errorMessage).toContain("The property <strong>Identifiant</strong> is required.");
    expect(result.errorMessage).toContain("The property <strong>Libellé</strong> is required.");
    expect(result.errorMessage).toContain("The property <strong>Label</strong> is required.");
    expect(result.errorMessage).toContain(
      "The property <strong>Propriétaire</strong> is required.",
    );
    expect(result.errorMessage).toContain(
      "The property <strong>Statut de diffusion</strong> is required.",
    );

    expect(result.fields.lastListUriSegment).toBe(
      "The property <strong>URI souhaité pour la liste de codes</strong> is required.",
    );
    expect(result.fields.lastCodeUriSegment).toBe(
      "The property <strong>Modèle souhaité pour les URI des codes</strong> is required.",
    );
    expect(result.fields.lastClassUriSegment).toBe(
      "The property <strong>URI du concept associé</strong> is required.",
    );
    expect(result.fields.id).toBe("The property <strong>Identifiant</strong> is required.");
    expect(result.fields.labelLg1).toBe("The property <strong>Libellé</strong> is required.");
    expect(result.fields.labelLg2).toBe("The property <strong>Label</strong> is required.");
    expect(result.fields.creator).toBe("The property <strong>Propriétaire</strong> is required.");
    expect(result.fields.disseminationStatus).toBe(
      "The property <strong>Statut de diffusion</strong> is required.",
    );
  });

  it("should pass validation for valid codelist", () => {
    const codelist = {
      lastListUriSegment: "segment1",
      lastCodeUriSegment: "segment2",
      lastClassUriSegment: "segment3",
      id: "valid_id_123",
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
      lastClassUriSegment: "",
      lastCodeUriSegment: "",
      lastListUriSegment: "",
    });
  });
});
