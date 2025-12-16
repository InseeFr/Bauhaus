import { validate } from "./validation";

describe("validation", function () {
  it("should return an error for id", function () {
    expect(
      validate({
        identifiant: "",
        labelLg1: "labelLg1",
        labelLg2: "labelLg2",
      }),
    ).toEqual({
      errorMessage: ["The property <strong>Notation</strong> is required."],
      fields: {
        identifiant: "The property <strong>Notation</strong> is required.",
        labelLg1: "",
        labelLg2: "",
      },
    });
  });
  it("should return an error for labelLg1", function () {
    expect(
      validate({
        identifiant: "id",
        labelLg1: "",
        labelLg2: "labelLg2",
      }),
    ).toEqual({
      errorMessage: ["The property <strong>Libellé</strong> is required."],
      fields: {
        identifiant: "",
        labelLg1: "The property <strong>Libellé</strong> is required.",
        labelLg2: "",
      },
    });
  });
  it("should return an error for labelLg2", function () {
    expect(
      validate({
        identifiant: "id",
        labelLg1: "labelLg1",
        labelLg2: "",
      }),
    ).toEqual({
      errorMessage: ["The property <strong>Label</strong> is required."],
      fields: {
        identifiant: "",
        labelLg1: "",
        labelLg2: "The property <strong>Label</strong> is required.",
      },
    });
  });
  it("should return no error", function () {
    expect(
      validate({
        identifiant: "id",
        labelLg1: "labelLg1",
        labelLg2: "labelLg2",
      }),
    ).toEqual({
      errorMessage: [],
      fields: {
        identifiant: "",
        labelLg1: "",
        labelLg2: "",
      },
    });
  });
});
