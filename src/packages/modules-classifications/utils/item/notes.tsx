import { buildEmptyNotes } from "@utils/build-empty-notes";

export const versionableNotes = [
  "scopeNoteLg1",
  "scopeNoteLg2",
  "definitionLg1",
  "definitionLg2",
  "coreContentNoteLg1",
  "coreContentNoteLg2",
  "additionalContentNoteLg1",
  "additionalContentNoteLg2",
  "exclusionNoteLg1",
  "exclusionNoteLg2",
];

export const datableNotes = ["changeNoteLg1", "changeNoteLg2"];

const allNotes = [...versionableNotes, ...datableNotes];

export const fields = allNotes;

export const emptyNotes = buildEmptyNotes(fields);
