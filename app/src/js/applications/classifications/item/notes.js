import React from 'react';
import PropTypes from 'prop-types';
import NoteVisualization from 'js/applications/shared/note-visualization';
import { buildNotes } from 'js/applications/classifications/utils/classification/notes';
import D, { D2 } from 'js/i18n';
import { stringToDate } from 'js/utils/moment';
import { HTMLUtils } from 'bauhaus-utilities';
function ClassificationNotes({ secondLang, notes, langs }) {
	const noteValues = buildNotes(notes).map(note => {
		if (note.title === 'classificationsChangeNote') {
			const Dictionnary = secondLang ? D2 : D;
			return Dictionnary.classificationsChangeNote(
				stringToDate(HTMLUtils.delPTags(notes.changeNoteDate))
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
		/>
	);
}

ClassificationNotes.propTypes = {
	secondLang: PropTypes.bool.isRequired,
	notes: PropTypes.object.isRequired,
	langs: PropTypes.object.isRequired,
};
export default ClassificationNotes;
