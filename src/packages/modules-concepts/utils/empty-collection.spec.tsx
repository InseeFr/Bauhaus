import emptyCollection from "./empty-collection";

describe("emptyCollection", () => {
  it("should return the empty collection skeleton", () => {
    expect(emptyCollection("")).toEqual({
      general: {
        contributor: "",
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
