export default (oldNotes, newNotes) => {
  const isChangeNote = Boolean(oldNotes.changeNoteFr);
  const isChangeNoteHasChanged =
    oldNotes.changeNotFer !== newNotes.changeNoteFr;
  return isChangeNote && isChangeNoteHasChanged;
};
