import { ConceptGeneral } from "@model/concepts/concept";

import { mandatoryPropertyError } from "@utils/validation.testing";

import { validate } from "./validation";

// `validate` ne lit que disseminationStatus, le reste est transmis tel quel au schéma.
const baseGeneral = {
  prefLabelLg1: "prefLabelLg1",
  creator: "creator",
  disseminationStatus: "Privé",
} as ConceptGeneral;

const baseNotes = {
  scopeNoteLg1: "scopeNote1",
  scopeNoteLg2: "scopeNote2",
  definitionLg1: "definitionLg1",
};

const OLD_LABEL_LG1 = "oldLabelLg1";
const MAX_LENGTH_SCOPE_NOTE = 350;
const otherConcepts = [{ id: "c0", label: "existingLabel" }];

const NO_FIELD_ERROR = {
  prefLabelLg1: "",
  creator: "",
  disseminationStatus: "",
  scopeNoteLg1: "",
  scopeNoteLg2: "",
  definitionLg1: "",
};

const creatorRequired = mandatoryPropertyError("Owner");
const labelAlreadyExists = "This label already exists";
const scopeNoteTooLong = "Short definition is limited to 350 characters";
const scopeNoteRequiredWhenPublic =
  "As dissemination status is public, short definition has to be completed";

const cases: {
  name: string;
  general: ConceptGeneral;
  notes: Parameters<typeof validate>[1];
  conceptsWithLinks: Parameters<typeof validate>[3];
  expected: ReturnType<typeof validate>;
}[] = [
  {
    name: "should return an error for creator",
    general: { ...baseGeneral, creator: "" } as ConceptGeneral,
    notes: baseNotes,
    conceptsWithLinks: otherConcepts,
    expected: {
      errorMessage: [creatorRequired],
      fields: { ...NO_FIELD_ERROR, creator: creatorRequired },
    },
  },
  {
    name: "should return an error if prefLabelLg1 already exists",
    general: baseGeneral,
    notes: baseNotes,
    conceptsWithLinks: [{ id: "c0", label: "prefLabelLg1" }],
    expected: {
      errorMessage: [labelAlreadyExists],
      fields: { ...NO_FIELD_ERROR, prefLabelLg1: labelAlreadyExists },
    },
  },
  {
    name: "should return an error if scopeNoteLg1 and scopeNoteLg2 are too long",
    general: baseGeneral,
    notes: { ...baseNotes, scopeNoteLg1: "x".repeat(351), scopeNoteLg2: "y".repeat(351) },
    conceptsWithLinks: otherConcepts,
    expected: {
      errorMessage: [scopeNoteTooLong, scopeNoteTooLong],
      fields: {
        ...NO_FIELD_ERROR,
        scopeNoteLg1: scopeNoteTooLong,
        scopeNoteLg2: scopeNoteTooLong,
      },
    },
  },
  {
    name: "should return an error if disseminationStatus is Public and scopeNoteLg1 is empty",
    general: { ...baseGeneral, disseminationStatus: "Public" } as ConceptGeneral,
    notes: { ...baseNotes, scopeNoteLg1: "" },
    conceptsWithLinks: otherConcepts,
    expected: {
      errorMessage: [scopeNoteRequiredWhenPublic],
      fields: { ...NO_FIELD_ERROR, scopeNoteLg1: scopeNoteRequiredWhenPublic },
    },
  },
  {
    name: "should return no error",
    general: baseGeneral,
    notes: baseNotes,
    conceptsWithLinks: otherConcepts,
    expected: {
      errorMessage: [],
      fields: NO_FIELD_ERROR,
    },
  },
];

describe("validation", function () {
  cases.forEach(({ name, general, notes, conceptsWithLinks, expected }) => {
    it(name, function () {
      expect(
        validate(general, notes, OLD_LABEL_LG1, conceptsWithLinks, MAX_LENGTH_SCOPE_NOTE),
      ).toEqual(expected);
    });
  });
});
