import { validate } from "./validation";

describe("validation", function () {
  it("should return an error for creator", function () {
    expect(
      validate(
        {
          id: "id",
          prefLabelLg1: "prefLabelLg1",
          creator: "",
        },
        [],
        "prefLabelLg1",
      ),
    ).toEqual({
      errorMessage: ["The property <strong>Owner</strong> is required."],
      fields: {
        id: "",
        prefLabelLg1: "",
        creator: "The property <strong>Owner</strong> is required.",
      },
    });
  });

  it("should return an error if prefLabelLg1 already exists", function () {
    expect(
      validate(
        {
          id: "id",
          prefLabelLg1: "éXèmplê",
          creator: "creator",
        },
        [{ id: "other", label: "exemple" }],
        "prefLabelLg1",
      ),
    ).toEqual({
      errorMessage: ["This label already exists"],
      fields: {
        id: "",
        prefLabelLg1: "This label already exists",
        creator: "",
      },
    });
  });

  it("should return an error when id is missing in creation mode", function () {
    const result = validate(
      {
        id: "",
        prefLabelLg1: "label",
        creator: "creator",
      },
      [],
      "",
    );
    expect(result.fields.id).toEqual("The property <strong>Identifier</strong> is required.");
  });

  it("should return an error when id contains forbidden characters", function () {
    const result = validate(
      {
        id: "café avec espaces",
        prefLabelLg1: "label",
        creator: "creator",
      },
      [],
      "",
    );
    expect(result.fields.id).toEqual("Invalid identifier");
  });

  it("should accept a valid id with alphanumeric and hyphens", function () {
    const result = validate(
      {
        id: "Collection-001",
        prefLabelLg1: "label",
        creator: "creator",
      },
      [],
      "",
    );
    expect(result.fields.id).toEqual("");
  });

  it("should return no error", function () {
    expect(
      validate(
        {
          id: "id",
          prefLabelLg1: "prefLabelLg1",
          creator: "creator",
        },
        [],
        "prefLabelLg1",
      ),
    ).toEqual({
      errorMessage: [],
      fields: {
        id: "",
        prefLabelLg1: "",
        creator: "",
      },
    });
  });
});
