import React from 'react';
import PropTypes from 'prop-types';
import NoteVisualization from 'js/components/shared/note-visualization';
import D from 'js/i18n';

function ConceptNotes({ secondLang, notes, langs }) {
	const {
		scopeNoteLg1,
		scopeNoteLg2,
		definitionLg1,
		definitionLg2,
		editorialNoteLg1,
		editorialNoteLg2,
		changeNoteLg1,
		changeNoteLg2,
	} = notes;
	const params = [
		{ lg1: scopeNoteLg1, lg2: scopeNoteLg2, title: D.conceptsScopeNote },
		{ lg1: definitionLg1, lg2: definitionLg2, title: D.conceptsDefinition },
		{
			lg1: editorialNoteLg1,
			lg2: editorialNoteLg2,
			title: D.conceptsEditorialNote,
		},
		{ lg1: changeNoteLg1, lg2: changeNoteLg2, title: D.conceptsChangeNote },
	];
	return (
		<NoteVisualization params={params} langs={langs} secondLang={secondLang} />
	);
}

ConceptNotes.propTypes = {
	secondLang: PropTypes.bool.isRequired,
	notes: PropTypes.object.isRequired,
};
export default ConceptNotes;
