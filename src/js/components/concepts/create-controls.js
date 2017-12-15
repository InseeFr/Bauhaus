import React from 'react';
import PropTypes from 'prop-types';
import deburr from 'lodash/deburr';
import ConceptCreateControlLayout from './create-controls-layout';
import { maxLengthScopeNote } from 'config/config';
import { dictionary } from 'js/utils/dictionary';
import { htmlLength, htmlIsEmpty } from 'js/utils/html';
import { arrayKeepUniqueField } from 'js/utils/array-utils';
import { propTypes as notesPropTypes } from 'js/utils/concepts/notes';
import { propTypes as generalPropTypes } from 'js/utils/concepts/general';
import { propTypes as conceptsWithLinksPropTypes } from 'js/utils/concepts/links';

//TODO check logic (if not changed but not unique => ok ?)
//TODO check if we need to call deburr on concept labels
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
	handleSave,
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
	//TODO check how to deal with notes like `<p></p>`: is it empty ?
	const isMissingConcept = !(prefLabelLg1 && creator && disseminationStatus);
	const isDefinitionLg1Missing = htmlIsEmpty(definitionLg1);
	//TODO verify check on `disseminationStatus` works as expected
	const isStatusPublicAndDefinitionMissing =
		disseminationStatus.includes('Public') && htmlIsEmpty(scopeNoteLg1);
	const hasScopeNoteLg2NotLg1 = scndWithoutFirst(scopeNoteLg1, scopeNoteLg2);
	const isScopeNoteTooLong =
		htmlLength(scopeNoteLg1) > maxLengthScopeNote ||
		htmlLength(scopeNoteLg2) > maxLengthScopeNote;
	const hasNoteEditorialeLg2NotLg1 = scndWithoutFirst(
		editorialNoteLg1,
		editorialNoteLg2
	);
	const hasChangeNoteLg2NotLg1 = scndWithoutFirst(changeNoteLg1, changeNoteLg2);
	if (isPrefLabelLg1Existing) {
		message = dictionary.warning.duplicated.label;
		//save disabled
	} else if (isMissingConcept) {
		message = dictionary.warning.missing.concept;
	} else if (isDefinitionLg1Missing) {
		message = dictionary.warning.notes.definitionLg1;
	} else if (isStatusPublicAndDefinitionMissing) {
		message = dictionary.warning.notes.scopeNoteLg1;
	} else if (hasScopeNoteLg2NotLg1) {
		message = dictionary.warning.notes.scopeNote;
	} else if (isScopeNoteTooLong) {
		message = dictionary.warning.notes.maxLengthScopeNote(maxLengthScopeNote);
	} else if (hasNoteEditorialeLg2NotLg1) {
		message = dictionary.warning.notes.editorialeNote;
	} else if (hasChangeNoteLg2NotLg1) {
		message = dictionary.warning.notes.changeNote;
	} else {
		//TODO missing else statement ? for instance if no creator ?
		//prefLabelLg1 && creator &&  disseminationStatus && !isLabelFrExisting &&
		//isDefinitionFr
		//no message
		saveEnabled = true;
	}
	return (
		<ConceptCreateControlLayout
			handleSave={handleSave}
			message={message}
			saveEnabled={saveEnabled}
		/>
	);
}

ConceptCreateControl.propTypes = {
	oldGeneral: generalPropTypes.isRequired,
	general: generalPropTypes.isRequired,
	notes: notesPropTypes.isRequired,
	conceptsWithLinks: conceptsWithLinksPropTypes.isRequired,
	handleSave: PropTypes.func.isRequired,
};
export default ConceptCreateControl;
