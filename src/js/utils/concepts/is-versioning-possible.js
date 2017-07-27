export default (oldNotes, newNotes) => {
  const isChangeNote = Boolean(oldNotes.changeNoteLg1);
  const isChangeNoteHasChanged =
    oldNotes.changeNotFer !== newNotes.changeNoteLg1;
  return isChangeNote && isChangeNoteHasChanged;
};
