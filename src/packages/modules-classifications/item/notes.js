import { NoteVisualization } from '../../components';
import { buildNotes } from '../utils/classification/notes';
import D, { D2 } from '../../deprecated-locales';
import { delPTags } from '../../utils/html-utils';
import { stringToDate } from '../../utils/date-utils';
function ClassificationNotes({ secondLang, notes, langs }) {
	const noteValues = buildNotes(notes).map((note) => {
		if (note.title === 'classificationsChangeNote') {
			const Dictionnary = secondLang ? D2 : D;
			return Dictionnary.classificationsChangeNote(
				stringToDate(delPTags(notes.changeNoteDate))
			);
		}
		return note;
	});
	return (
		<NoteVisualization
			params={noteValues}
			langs={langs}
			secondLang={secondLang}
			context="classifications"
			md
		/>
	);
}

export default ClassificationNotes;
