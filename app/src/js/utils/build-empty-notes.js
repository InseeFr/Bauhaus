export const buildEmptyNotes = fields =>
	fields.reduce((notes, typeOfNote) => {
		notes[typeOfNote] = '';
		return notes;
	}, {});
