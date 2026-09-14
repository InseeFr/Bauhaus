import { ConceptNotes } from "@model/concepts/concept";

export const versionableNoteFields: (keyof ConceptNotes)[] = [
  "scopeNoteLg1",
  "scopeNoteLg2",
  "definitionLg1",
  "definitionLg2",
  "editorialNoteLg1",
  "editorialNoteLg2",
];

export const datableNoteFields: (keyof ConceptNotes)[] = ["changeNoteLg1", "changeNoteLg2"];

export const versionImpactingNoteFields: (keyof ConceptNotes)[] = [
  "scopeNoteLg1",
  "definitionLg1",
  "editorialNoteLg1",
];
