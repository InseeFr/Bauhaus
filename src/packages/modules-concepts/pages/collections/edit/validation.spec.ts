import { mandatoryPropertyError } from "@utils/validation.testing";

import { validate } from "./validation";

const collection = {
  id: "id",
  prefLabelLg1: "prefLabelLg1",
  creator: "creator",
};

const NO_FIELD_ERROR = {
  id: "",
  prefLabelLg1: "",
  creator: "",
};

const creatorRequired = mandatoryPropertyError("Owner");
const identifierRequired = mandatoryPropertyError("Identifier");
const labelAlreadyExists = "This label already exists";

const validateCollection = (
  general: Parameters<typeof validate>[0],
  collectionList: Parameters<typeof validate>[1] = [],
  initialPrefLabelLg1 = "",
) => validate(general, collectionList, initialPrefLabelLg1);

describe("validation", function () {
  it("should return an error for creator", function () {
    expect(validateCollection({ ...collection, creator: "" }, [], "prefLabelLg1")).toEqual({
      errorMessage: [creatorRequired],
      fields: { ...NO_FIELD_ERROR, creator: creatorRequired },
    });
  });

  it("should return an error if prefLabelLg1 already exists", function () {
    expect(
      validateCollection(
        { ...collection, prefLabelLg1: "éXèmplê" },
        [{ id: "other", label: "exemple" }],
        "prefLabelLg1",
      ),
    ).toEqual({
      errorMessage: [labelAlreadyExists],
      fields: { ...NO_FIELD_ERROR, prefLabelLg1: labelAlreadyExists },
    });
  });

  it("should return an error when id is missing in creation mode", function () {
    const result = validateCollection({ ...collection, id: "", prefLabelLg1: "label" });
    expect(result.fields.id).toEqual(identifierRequired);
  });

  it("should return an error when id contains forbidden characters", function () {
    const result = validateCollection({
      ...collection,
      id: "café avec espaces",
      prefLabelLg1: "label",
    });
    expect(result.fields.id).toEqual("Invalid identifier");
  });

  it("should accept a valid id with alphanumeric and hyphens", function () {
    const result = validateCollection({
      ...collection,
      id: "Collection-001",
      prefLabelLg1: "label",
    });
    expect(result.fields.id).toEqual("");
  });

  it("should return no error", function () {
    expect(validateCollection(collection, [], "prefLabelLg1")).toEqual({
      errorMessage: [],
      fields: NO_FIELD_ERROR,
    });
  });
});
