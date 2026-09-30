import { sdkRejection } from "../tests/sdk-rejection.testing";
import { getApiErrorMessage, getApiErrors, isNotFound, toFormErrors } from "./api-errors";

describe("getApiErrorMessage", () => {
  it("lit le message d'un rejet nu du SDK", () => {
    expect(getApiErrorMessage({ message: "Boom", status: 500 }, "repli")).toBe("Boom");
  });

  it("lit le message d'une vraie Error", () => {
    expect(getApiErrorMessage(new Error("Boom"), "repli")).toBe("Boom");
  });

  it("retombe sur le repli quand il n'y a pas de message", () => {
    expect(getApiErrorMessage({ status: 500 }, "repli")).toBe("repli");
  });

  it("retombe sur le repli quand le message est vide", () => {
    expect(getApiErrorMessage({ message: "" }, "repli")).toBe("repli");
  });

  it("retombe sur le repli de l'écran pour un échec produit par le SDK, qui n'est pas un message du serveur", () => {
    expect(getApiErrorMessage(sdkRejection.network(), "repli")).toBe("repli");
    expect(getApiErrorMessage(sdkRejection.unreadableResponse(200), "repli")).toBe("repli");
  });

  it("retombe sur le repli quand le message est du JSON", () => {
    expect(getApiErrorMessage(sdkRejection.text(500, '{"code":804}'), "repli")).toBe("repli");
  });

  it("retombe sur le repli sur une valeur non exploitable", () => {
    expect(getApiErrorMessage(null, "repli")).toBe("repli");
    expect(getApiErrorMessage("texte", "repli")).toBe("repli");
  });
});

it("lit le champ `detail` d'une réponse RFC 7807 du back", () => {
  expect(
    getApiErrorMessage(
      { detail: "Collections already published: c1000", title: "Bad Request", status: 400 },
      "repli",
    ),
  ).toBe("Collections already published: c1000");
});

it("privilégie `message` sur `detail`", () => {
  expect(getApiErrorMessage({ message: "message", detail: "detail" }, "repli")).toBe("message");
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

  it("lit les erreurs de schéma DDI4, qui sont des chaînes", () => {
    expect(
      getApiErrors({ valid: false, errors: ["$.PhysicalInstance: is missing", "$.x: bad"] }),
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
