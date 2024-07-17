import NoteVisualization from '../../../applications/shared/note-visualization';
import { buildNotes } from '../../../applications/classifications/utils/classification/notes';
import D, { D2 } from '../../../i18n';
import { HTMLUtils, DateUtils } from '../../../utils';
function ClassificationNotes({ secondLang, notes, langs }) {
	const noteValues = buildNotes(notes).map((note) => {
		if (note.title === 'classificationsChangeNote') {
			const Dictionnary = secondLang ? D2 : D;
			return Dictionnary.classificationsChangeNote(
				DateUtils.stringToDate(HTMLUtils.delPTags(notes.changeNoteDate))
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
