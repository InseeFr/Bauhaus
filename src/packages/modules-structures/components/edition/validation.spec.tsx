import { validate } from "./validation";

describe("validation", function () {
  it("should return an error for identifiant", function () {
    expect(
      validate({
        labelLg1: "labelLg1",
        labelLg2: "labelLg2",
        type: "type",
      }),
    ).toEqual({
      errorMessage: ["The property <strong>Notation</strong> is required."],
      fields: {
        identifiant: "The property <strong>Notation</strong> is required.",
        labelLg1: "",
        labelLg2: "",
        type: "",
      },
    });
  });
  it("should return an error for labelLg1 and labelLg2", function () {
    expect(
      validate({
        identifiant: "id",
        type: "type",
      }),
    ).toEqual({
      errorMessage: [
        "The property <strong>Libellé</strong> is required.",
        "The property <strong>Label</strong> is required.",
      ],
      fields: {
        identifiant: "",
        labelLg1: "The property <strong>Libellé</strong> is required.",
        labelLg2: "The property <strong>Label</strong> is required.",
        type: "",
      },
    });
  });
  it("should return an error for type", function () {
    expect(
      validate({
        identifiant: "id",
        labelLg1: "labelLg1",
        labelLg2: "labelLg2",
      }),
    ).toEqual({
      errorMessage: ["The property <strong>Type</strong> is required."],
      fields: {
        identifiant: "",
        labelLg1: "",
        labelLg2: "",
        type: "The property <strong>Type</strong> is required.",
      },
    });
  });
  it("should return no error", function () {
    expect(
      validate({
        identifiant: "id",
        labelLg1: "labelLg1",
        labelLg2: "labelLg2",
        type: "type",
      }),
    ).toEqual({
      errorMessage: [],
      fields: {
        identifiant: "",
        labelLg1: "",
        labelLg2: "",
        type: "",
      },
    });
  });
});
