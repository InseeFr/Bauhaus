import { getApiErrorMessage, getApiErrors } from "./api-errors";

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
