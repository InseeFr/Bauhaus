import React from 'react';
import PropTypes from 'prop-types';
import NoteVisualization from 'js/components/shared/note-visualization';
import { buildNotes } from 'js/utils/classifications/classification/notes';

function ClassificationNotes({ secondLang, notes, langs }) {
	return (
		<NoteVisualization
			params={buildNotes(notes)}
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
