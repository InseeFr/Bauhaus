import React from 'react';
import PropTypes from 'prop-types';
import deburr from 'lodash/deburr';
import ConceptCreateControlLayout from './controls-layout';
import D from 'js/i18n';
import { htmlLength, htmlIsEmpty } from 'js/utils/html';
import { arrayKeepUniqueField } from 'js/utils/array-utils';
import { propTypes as notesPropTypes } from 'js/utils/concepts/notes';
import { propTypes as generalPropTypes } from 'js/utils/concepts/general';
import { propTypes as conceptsWithLinksPropTypes } from 'js/utils/concepts/links';

const checkPrefLabelFrExisting = (
	concepts,
	prefLabelLg1,
	initialPrefLabelFr
) => {
	return (
		//if it has not changed, it's ok
		prefLabelLg1 !== initialPrefLabelFr &&
		arrayKeepUniqueField(concepts, 'label').indexOf(
			deburr(prefLabelLg1.toLowerCase())
		) !== -1
	);
};

export const scndWithoutFirst = (first, second) => {
	return !htmlIsEmpty(second) && htmlIsEmpty(first);
};

function ConceptCreateControl({
	oldGeneral,
	general,
	notes,
	conceptsWithLinks,
	maxLengthScopeNote,
	handleSave,
	redirectCancel,
}) {
	let message;
	let saveEnabled = false;
	const { prefLabelLg1: initialPrefLabelFr } = oldGeneral;
	const { prefLabelLg1, creator, disseminationStatus } = general;
	const {
		definitionLg1,
		scopeNoteLg1,
		scopeNoteLg2,
		editorialNoteLg1,
		editorialNoteLg2,
		changeNoteLg1,
		changeNoteLg2,
	} = notes;

	const isPrefLabelLg1Existing = checkPrefLabelFrExisting(
		conceptsWithLinks,
		prefLabelLg1,
		initialPrefLabelFr
	);
	const isMissingConcept = !(prefLabelLg1 && creator && disseminationStatus);
	const isDefinitionLg1Empty = htmlIsEmpty(definitionLg1);
	const isStatusPublicAndEmptyScopeNote =
		disseminationStatus.includes('Public') && htmlIsEmpty(scopeNoteLg1);
	const hasScopeNoteLg2NotLg1 = scndWithoutFirst(scopeNoteLg1, scopeNoteLg2);
	const isScopeNoteTooLong =
		htmlLength(scopeNoteLg1) > maxLengthScopeNote ||
		htmlLength(scopeNoteLg2) > maxLengthScopeNote;
	const hasEditorialNoteLg2NotLg1 = scndWithoutFirst(
		editorialNoteLg1,
		editorialNoteLg2
	);
	const hasChangeNoteLg2NotLg1 = scndWithoutFirst(changeNoteLg1, changeNoteLg2);
	if (isPrefLabelLg1Existing) {
		message = D.duplicatedLabel;
		//save disabled
	} else if (isMissingConcept) {
		message = D.incompleteConcept;
	} else if (isDefinitionLg1Empty) {
		message = D.emptyDefinitionLg1;
	} else if (isStatusPublicAndEmptyScopeNote) {
		message = D.emptyScopeNoteLg1;
	} else if (hasScopeNoteLg2NotLg1) {
		message = D.hasScopeNoteLg2NotLg1;
	} else if (isScopeNoteTooLong) {
		message = D.tooLongScopeNote(maxLengthScopeNote);
	} else if (hasEditorialNoteLg2NotLg1) {
		message = D.hasEditorialNoteLg2NotLg1;
	} else if (hasChangeNoteLg2NotLg1) {
		message = D.hasChangeNoteLg2NotLg1;
	} else {
		saveEnabled = true;
	}
	return (
		<ConceptCreateControlLayout
			handleSave={handleSave}
			message={message}
			saveEnabled={saveEnabled}
			redirectCancel={redirectCancel}
		/>
	);
}

ConceptCreateControl.propTypes = {
	oldGeneral: generalPropTypes.isRequired,
	general: generalPropTypes.isRequired,
	notes: notesPropTypes.isRequired,
	conceptsWithLinks: conceptsWithLinksPropTypes.isRequired,
	handleSave: PropTypes.func.isRequired,
	redirectCancel: PropTypes.func.isRequired,
};
export default ConceptCreateControl;
