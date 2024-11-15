export const buildEmptyNotes = (fields: string[]): Record<string, ''> =>
	fields.reduce((notes: Record<string, ''>, typeOfNote) => {
		notes[typeOfNote] = '';
		return notes;
	}, {});
