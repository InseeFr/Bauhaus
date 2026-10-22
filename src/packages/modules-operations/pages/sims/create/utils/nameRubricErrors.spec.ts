import { sdkRejection } from "../../../../../tests/sdk-rejection.testing";
import { nameRubricErrors } from "./nameRubricErrors";

const metadataStructure = {
  S1: {
    idMas: "S1",
    masLabelBasedOnCurrentLang: "Contact",
    children: {
      "S.1.1": { idMas: "S.1.1", masLabelBasedOnCurrentLang: "Organisation", children: {} },
    },
  },
  S3: { idMas: "S3", masLabelBasedOnCurrentLang: "Concepts", children: {} },
};

const rubrics = [{ idAttribute: "S1" }, { idAttribute: "S.1.1" }, { idAttribute: "S3" }];

const languages = { Lg1: "Première langue", Lg2: "Seconde langue" };

const rejectionOn = (field?: string) =>
  sdkRejection.json(400, {
    message: "Validation failed",
    errors: [{ ...(field === undefined ? {} : { field }), message: "too long" }],
  });

const fieldsOf = (error: unknown) =>
  (error as { errors: { field?: string }[] }).errors.map(({ field }) => field);

describe("nameRubricErrors", () => {
  it("nomme la rubrique visée par son indice dans la liste envoyée", () => {
    const named = nameRubricErrors(rejectionOn("rubrics[1].value"), {
      rubrics,
      metadataStructure,
      languages,
    });

    expect(fieldsOf(named)).toEqual(["S.1.1 - Organisation"]);
  });

  it("précise la langue quand le champ en porte une", () => {
    const named = nameRubricErrors(rejectionOn("rubrics[2].labelLg2"), {
      rubrics,
      metadataStructure,
      languages,
    });

    expect(fieldsOf(named)).toEqual(["S3 - Concepts (Seconde langue)"]);
  });

  it("précise la langue d'un document de la rubrique", () => {
    const named = nameRubricErrors(rejectionOn("rubrics[0].documentsLg1[0].url"), {
      rubrics,
      metadataStructure,
      languages,
    });

    expect(fieldsOf(named)).toEqual(["S1 - Contact (Première langue)"]);
  });

  it("garde l'identifiant seul pour une rubrique absente de la structure", () => {
    const named = nameRubricErrors(rejectionOn("rubrics[0].value"), {
      rubrics: [{ idAttribute: "S.9.9" }],
      metadataStructure,
      languages,
    });

    expect(fieldsOf(named)).toEqual(["S.9.9"]);
  });

  it("laisse tel quel un champ qui ne désigne pas une rubrique envoyée", () => {
    const named = nameRubricErrors(
      sdkRejection.json(400, {
        errors: [
          { field: "labelLg1", message: "must not be blank" },
          { field: "rubrics[7].value", message: "too long" },
          { message: "whole body" },
        ],
      }),
      { rubrics, metadataStructure, languages },
    );

    expect(fieldsOf(named)).toEqual(["labelLg1", "rubrics[7].value", undefined]);
  });

  it("garde le reste du rejet", () => {
    const named = nameRubricErrors(rejectionOn("rubrics[1].value"), {
      rubrics,
      metadataStructure,
      languages,
    });

    expect(named).toMatchObject({
      status: 400,
      message: "Validation failed",
      errors: [{ message: "too long" }],
    });
  });

  it("rend tel quel un rejet sans erreurs détaillées", () => {
    const rejection = sdkRejection.json(500, { message: "Boom" });

    expect(nameRubricErrors(rejection, { rubrics, metadataStructure, languages })).toBe(rejection);
  });
});
