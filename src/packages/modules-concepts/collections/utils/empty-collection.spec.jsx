import defaultContributor from "./empty-collection";

describe("defaultContributor", () => {
  it("should return the defaultContributor", () => {
    expect(defaultContributor()).toEqual({
      general: {
        contributor: undefined,
        created: "",
        creator: "",
        descriptionLg1: "",
        descriptionLg2: "",
        id: "",
        isValidated: "",
        modified: "",
        prefLabelLg1: "",
        prefLabelLg2: "",
      },
      members: [],
    });
  });
});
