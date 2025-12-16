import { validate } from "./validation";

describe("validation", function () {
  it("should return an error for creator", function () {
    const general = {
      prefLabelLg1: "prefLabelLg1",
      creator: "",
      disseminationStatus: "Privé",
    };

    const notes = {
      scopeNoteLg1: "scopeNote1",
      scopeNoteLg2: "scopeNote2",
      definitionLg1: "definitionLg1",
    };

    const oldLabelLg1 = "oldLabelLg1";

    const conceptsWithLinks = [{ id: "c0", label: "existingLabel" }];

    const maxLengthScopeNote = 350;

    expect(validate(general, notes, oldLabelLg1, conceptsWithLinks, maxLengthScopeNote)).toEqual({
      errorMessage: ["The property <strong>Owner</strong> is required."],
      fields: {
        prefLabelLg1: "",
        creator: "The property <strong>Owner</strong> is required.",
        disseminationStatus: "",
        scopeNoteLg1: "",
        scopeNoteLg2: "",
        definitionLg1: "",
      },
    });
  });

  it("should return an error if prefLabelLg1 already exists", function () {
    const general = {
      prefLabelLg1: "prefLabelLg1",
      creator: "creator",
      disseminationStatus: "Privé",
    };

    const notes = {
      scopeNoteLg1: "scopeNote1",
      scopeNoteLg2: "scopeNote2",
      definitionLg1: "definitionLg1",
    };

    const oldLabelLg1 = "oldLabelLg1";

    const conceptsWithLinks = [{ id: "c0", label: "prefLabelLg1" }];

    const maxLengthScopeNote = 350;

    expect(validate(general, notes, oldLabelLg1, conceptsWithLinks, maxLengthScopeNote)).toEqual({
      errorMessage: ["This label already exists"],
      fields: {
        prefLabelLg1: "This label already exists",
        creator: "",
        disseminationStatus: "",
        scopeNoteLg1: "",
        scopeNoteLg2: "",
        definitionLg1: "",
      },
    });
  });

  it("should return an error if scopeNoteLg1 and scopeNoteLg2 are too long", function () {
    const general = {
      prefLabelLg1: "prefLabelLg1",
      creator: "creator",
      disseminationStatus: "Privé",
    };

    const notes = {
      scopeNoteLg1: "x".repeat(351),
      scopeNoteLg2: "y".repeat(351),
      definitionLg1: "definitionLg1",
    };

    const oldLabelLg1 = "oldLabelLg1";

    const conceptsWithLinks = [{ id: "c0", label: "existingLabel" }];

    const maxLengthScopeNote = 350;

    expect(validate(general, notes, oldLabelLg1, conceptsWithLinks, maxLengthScopeNote)).toEqual({
      errorMessage: [
        "Short definition is limited to 350 characters",
        "Short definition is limited to 350 characters",
      ],
      fields: {
        prefLabelLg1: "",
        creator: "",
        disseminationStatus: "",
        scopeNoteLg1: "Short definition is limited to 350 characters",
        scopeNoteLg2: "Short definition is limited to 350 characters",
        definitionLg1: "",
      },
    });
  });

  it("should return an error if disseminationStatus is Public and scopeNoteLg1 is empty", function () {
    const general = {
      prefLabelLg1: "prefLabelLg1",
      creator: "creator",
      disseminationStatus: "Public",
    };

    const notes = {
      scopeNoteLg1: "",
      scopeNoteLg2: "scopeNote2",
      definitionLg1: "definitionLg1",
    };

    const oldLabelLg1 = "oldLabelLg1";

    const conceptsWithLinks = [{ id: "c0", label: "existingLabel" }];

    const maxLengthScopeNote = 350;

    expect(validate(general, notes, oldLabelLg1, conceptsWithLinks, maxLengthScopeNote)).toEqual({
      errorMessage: ["As dissemination status is public, short definition has to be completed"],
      fields: {
        prefLabelLg1: "",
        creator: "",
        disseminationStatus: "",
        scopeNoteLg1: "As dissemination status is public, short definition has to be completed",
        scopeNoteLg2: "",
        definitionLg1: "",
      },
    });
  });

  it("should return no error", function () {
    const general = {
      prefLabelLg1: "prefLabelLg1",
      creator: "creator",
      disseminationStatus: "Privé",
    };

    const notes = {
      scopeNoteLg1: "scopeNote1",
      scopeNoteLg2: "scopeNote2",
      definitionLg1: "definitionLg1",
    };

    const oldLabelLg1 = "oldLabelLg1";

    const conceptsWithLinks = [{ id: "c0", label: "existingLabel" }];

    const maxLengthScopeNote = 350;

    expect(validate(general, notes, oldLabelLg1, conceptsWithLinks, maxLengthScopeNote)).toEqual({
      errorMessage: [],
      fields: {
        prefLabelLg1: "",
        creator: "",
        disseminationStatus: "",
        scopeNoteLg1: "",
        scopeNoteLg2: "",
        definitionLg1: "",
      },
    });
  });
});
