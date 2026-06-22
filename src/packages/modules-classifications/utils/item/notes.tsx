import { buildEmptyNotes } from "@utils/build-empty-notes";

const versionableNotes = [
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

const datableNotes = ["changeNoteLg1", "changeNoteLg2"];

const allNotes = [...versionableNotes, ...datableNotes];

export const emptyNotes = buildEmptyNotes(allNotes);
