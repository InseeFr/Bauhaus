import { emptyCollection } from "./emptyCollection";

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
        validationState: "",
        modified: "",
        prefLabelLg1: "",
        prefLabelLg2: "",
      },
      members: [],
    });
  });
});
