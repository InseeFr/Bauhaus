import React from 'react';
import PropTypes from 'prop-types';
import NoteVisualization from 'js/components/shared/note-visualization';
import D from 'js/i18n';

function ClassificationNotes({ secondLang, notes, langs }) {
	const {
		definitionLg1,
		definitionLg2,
		scopeNoteLg1,
		scopeNoteLg2,
		coreContentNoteLg1,
		coreContentNoteLg2,
		additionalContentNoteLg1,
		additionalContentNoteLg2,
		exclusionNoteLg1,
		exclusionNoteLg2,
		changeNoteLg1,
		changeNoteLg2,
	} = notes;
	const params = [
		{
			lg1: definitionLg1,
			lg2: definitionLg2,
			title: D.classificationsDefinition,
		},
		{ lg1: scopeNoteLg1, lg2: scopeNoteLg2, title: D.classificationsScopeNote },
		{
			lg1: coreContentNoteLg1,
			lg2: coreContentNoteLg2,
			title: D.classificationsCoreContentNote,
		},
		{
			lg1: additionalContentNoteLg1,
			lg2: additionalContentNoteLg2,
			title: D.classificationsAdditionalContentNote,
		},
		{
			lg1: exclusionNoteLg1,
			lg2: exclusionNoteLg2,
			title: D.classificationsExclusionNote,
		},
		{
			lg1: changeNoteLg1,
			lg2: changeNoteLg2,
			title: D.classificationsChangeNote,
		},
	];
	return (
		<NoteVisualization
			params={params}
			langs={langs}
			secondLang={secondLang}
			context="classifications"
		/>
	);
}

ClassificationNotes.propTypes = {
	secondLang: PropTypes.bool.isRequired,
	notes: PropTypes.object.isRequired,
};
export default ClassificationNotes;
