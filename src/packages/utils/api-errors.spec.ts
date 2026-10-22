import { appI18n } from "../i18n";
import { sdkRejection } from "../tests/sdk-rejection.testing";
import { formatApiErrors, getApiErrors, isNotFound, toFormErrors } from "./api-errors";

describe("formatApiErrors, lecteur unique des échecs d'appel (ADR-1264)", () => {
  const generic = () => appI18n.t("errors.fallback.generic");

  it("lit le message du corps", () => {
    expect(formatApiErrors(sdkRejection.json(409, { message: "Boom" }), appI18n)).toEqual(["Boom"]);
  });

  it("traduit le code plutôt que d'afficher le message anglais du back", () => {
    const error = sdkRejection.json(503, {
      message: "The DDI repository (Colectica) is unavailable. Please try again later.",
      code: "COLECTICA_UNAVAILABLE",
    });

    expect(formatApiErrors(error, appI18n, "repli")).toEqual([
      appI18n.t("errors.COLECTICA_UNAVAILABLE"),
    ]);
  });

  it("affiche le message du serveur quand le code n'a pas de traduction", () => {
    const error = sdkRejection.json(409, { message: "Boom", code: "UNKNOWN_CODE" });

    expect(formatApiErrors(error, appI18n, "repli")).toEqual(["Boom"]);
  });

  it("traduit l'échec réseau constaté par le SDK", () => {
    expect(formatApiErrors(sdkRejection.network(), appI18n, "repli")).toEqual([
      appI18n.t("errors.NETWORK_ERROR"),
    ]);
  });

  it("retombe sur le repli de l'écran quand le corps ne porte rien d'affichable", () => {
    expect(formatApiErrors(sdkRejection.emptyBody(500), appI18n, "repli")).toEqual(["repli"]);
    expect(formatApiErrors({ status: 400 }, appI18n, "repli")).toEqual(["repli"]);
  });

  it("retombe sur le repli du statut sans repli d'écran", () => {
    expect(formatApiErrors({ status: 400 }, appI18n)).toEqual([generic()]);
  });

  it("ne lit plus `detail`, retiré du contrat avec ProblemDetail", () => {
    expect(
      formatApiErrors({ detail: "Collections already published", status: 400 }, appI18n),
    ).toEqual([generic()]);
  });

  it("affiche telle quelle une ligne déjà rédigée par l'écran", () => {
    expect(formatApiErrors("Le libellé est obligatoire.", appI18n)).toEqual([
      "Le libellé est obligatoire.",
    ]);
  });
});

describe("getApiErrors", () => {
  it("lit les erreurs de champ du contrat de validation", () => {
    const errors = getApiErrors({
      errors: [
        { field: "numObservations", message: "must be greater than 0" },
        { field: "temporal.startDate", message: "is not a valid LocalDate" },
      ],
    });

    expect(errors).toEqual([
      "numObservations : must be greater than 0",
      "temporal.startDate : is not a valid LocalDate",
    ]);
  });

  it("n'affiche pas le champ sentinelle des erreurs portant sur le corps entier", () => {
    expect(
      getApiErrors({ errors: [{ field: "body", message: "the request body could not be read" }] }),
    ).toEqual(["the request body could not be read"]);
  });

  it("lit les erreurs de schéma DDI4, rattachées au corps entier", () => {
    expect(
      getApiErrors({
        message: "The submitted data is invalid",
        code: "DDI4_INVALID",
        errors: [
          { field: "body", message: "$.PhysicalInstance: is missing" },
          { field: "body", message: "$.x: bad" },
        ],
      }),
    ).toEqual(["$.PhysicalInstance: is missing", "$.x: bad"]);
  });

  it("renvoie null quand il n'y a pas d'erreurs détaillées", () => {
    expect(getApiErrors({ message: "Boom" })).toBeNull();
    expect(getApiErrors(new Error("Boom"))).toBeNull();
    expect(getApiErrors(null)).toBeNull();
  });

  it("renvoie null sur une liste d'erreurs vide", () => {
    expect(getApiErrors({ errors: [] })).toBeNull();
  });
});

describe("toFormErrors", () => {
  const displayedFields = ["prefLabelLg1", "prefLabelLg2"];

  it("place sous sa saisie l'erreur d'un champ affiché et garde les autres pour le bandeau", () => {
    expect(
      toFormErrors(
        {
          errors: [
            { field: "prefLabelLg1", message: "must not be blank" },
            { field: "created", message: "is not a valid LocalDate" },
          ],
        },
        displayedFields,
      ),
    ).toEqual({
      clientSideErrors: {
        errorMessage: ["must not be blank"],
        fields: { prefLabelLg1: "must not be blank" },
      },
      serverSideError: ["created : is not a valid LocalDate"],
    });
  });

  it("laisse le rejet entier au bandeau quand aucune erreur ne vise un champ affiché", () => {
    const err = { errors: [{ field: "created", message: "is not a valid LocalDate" }] };

    expect(toFormErrors(err, displayedFields)).toEqual({
      clientSideErrors: null,
      serverSideError: err,
    });
  });

  it("laisse au bandeau un rejet sans erreurs détaillées", () => {
    const err = { message: "Boom", status: 500 };

    expect(toFormErrors(err, displayedFields)).toEqual({
      clientSideErrors: null,
      serverSideError: err,
    });
  });

  it("laisse au bandeau un rejet chaîne", () => {
    expect(toFormErrors("Boom", displayedFields)).toEqual({
      clientSideErrors: null,
      serverSideError: "Boom",
    });
  });
});

describe("isNotFound", () => {
  it("recognises a 404 rejected by the SDK, whatever its body", () => {
    expect(isNotFound(sdkRejection.emptyBody(404))).toBe(true);
    expect(isNotFound(sdkRejection.json(404, { message: "Family not found" }))).toBe(true);
  });

  it("rejects any other failure", () => {
    expect(isNotFound(sdkRejection.emptyBody(500))).toBe(false);
    expect(isNotFound(sdkRejection.network())).toBe(false);
    expect(isNotFound(undefined)).toBe(false);
    expect(isNotFound("404")).toBe(false);
  });
});

describe("traduction d'un code avec ses paramètres", () => {
  const conceptLinked = sdkRejection.json(400, {
    code: "112",
    message: "The concept c1000 cannot be deleted because it is linked to other concepts.",
    params: { idConcept: "c1000" },
  });

  it("interpole les params du corps dans le bandeau", () => {
    expect(formatApiErrors(conceptLinked, appI18n)).toEqual([
      appI18n.t("errors.112", { idConcept: "c1000" }),
    ]);
    expect(formatApiErrors(conceptLinked, appI18n)[0]).toContain("c1000");
  });

  it("interpole les params du corps même avec un repli d'écran", () => {
    expect(formatApiErrors(conceptLinked, appI18n, "repli")[0]).toContain("c1000");
  });
});
