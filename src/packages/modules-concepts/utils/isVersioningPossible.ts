import { ConceptNotes } from "@model/concepts/concept";

export const isVersioningPossible = (oldNotes: ConceptNotes, newNotes: ConceptNotes) => {
  const isChangeNote = Boolean(newNotes.changeNoteLg1);

  const isChangeNoteHasChanged = oldNotes.changeNoteLg1 !== newNotes.changeNoteLg1;

  return isChangeNote ? isChangeNoteHasChanged : false;
};
