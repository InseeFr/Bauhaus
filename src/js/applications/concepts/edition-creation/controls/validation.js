import {
	htmlIsEmpty,
	htmlLength,
} from '../../../../new-architecture/utils/html-utils';
import D, { D1 } from '../../../../i18n';

export const scndWithoutFirst = (first, second) => {
	return !htmlIsEmpty(second) && htmlIsEmpty(first);
};

export const checkPrefLabelLg1Existing = (
	concepts,
	prefLabelLg1,
	initialPrefLabelFr
) => {
	return (
		prefLabelLg1 !== initialPrefLabelFr &&
		concepts.map((concept) => concept.label).indexOf(prefLabelLg1) !== -1
	);
};

const validate = (
	oldGeneral,
	newGeneral,
	notes,
	conceptsWithLinks,
	maxLengthScopeNote
) => {
	const errorMessage = [];
	const fields = {};

	const isPrefLabelLg1Existing = checkPrefLabelLg1Existing(
		conceptsWithLinks,
		newGeneral.prefLabelLg1,
		oldGeneral.prefLabelLg1
	);

	if (!newGeneral.prefLabelLg1) {
		errorMessage.push(D.mandatoryProperty(D1.labelTitle));
		fields.prefLabelLg1 = D.mandatoryProperty(D1.labelTitle);
	}
	if (isPrefLabelLg1Existing) {
		errorMessage.push(D.duplicatedLabel);
		fields.prefLabelLg1 = D.duplicatedLabel;
	}

	if (!newGeneral.creator) {
		errorMessage.push(D.mandatoryProperty(D.creatorTitle));
		fields.creator = D.mandatoryProperty(D.creatorTitle);
	}
	if (!newGeneral.disseminationStatus) {
		errorMessage.push(D.mandatoryProperty(D.disseminationStatusTitle));
		fields.disseminationStatus = D.mandatoryProperty(
			D.disseminationStatusTitle
		);
	}

	if (htmlIsEmpty(notes.definitionLg1)) {
		errorMessage.push(D.emptyDefinitionLg1);
		fields.definitionLg1 = D.emptyDefinitionLg1;
	}

	const isStatusPublicAndEmptyScopeNote =
		newGeneral.disseminationStatus.includes('Public') &&
		htmlIsEmpty(notes.scopeNoteLg1);

	if (isStatusPublicAndEmptyScopeNote) {
		errorMessage.push(D.emptyScopeNoteLg1);
		fields.scopeNoteLg1 = D.emptyScopeNoteLg1;
	}

	const hasScopeNoteLg2NotLg1 = scndWithoutFirst(
		notes.scopeNoteLg1,
		notes.scopeNoteLg2
	);

	if (hasScopeNoteLg2NotLg1) {
		errorMessage.push(D.hasScopeNoteLg2NotLg1);
		fields.scopeNoteLg1 = D.hasScopeNoteLg2NotLg1;
	}

	if (htmlLength(notes.scopeNoteLg1) > maxLengthScopeNote) {
		errorMessage.push(D.tooLongScopeNote(maxLengthScopeNote));
		fields.scopeNoteLg1 = D.tooLongScopeNote(maxLengthScopeNote);
	}
	if (htmlLength(notes.scopeNoteLg2) > maxLengthScopeNote) {
		errorMessage.push(D.tooLongScopeNote(maxLengthScopeNote));
		fields.scopeNoteLg2 = D.tooLongScopeNote(maxLengthScopeNote);
	}

	const hasEditorialNoteLg2NotLg1 = scndWithoutFirst(
		notes.editorialNoteLg1,
		notes.editorialNoteLg2
	);

	if (hasEditorialNoteLg2NotLg1) {
		errorMessage.push(D.hasEditorialNoteLg2NotLg1);
		fields.editorialNoteLg1 = D.hasEditorialNoteLg2NotLg1;
	}

	const hasChangeNoteLg2NotLg1 = scndWithoutFirst(
		notes.changeNoteLg1,
		notes.changeNoteLg2
	);

	if (hasChangeNoteLg2NotLg1) {
		errorMessage.push(D.hasChangeNoteLg2NotLg1);
		fields.changeNoteLg1 = D.hasChangeNoteLg2NotLg1;
	}

	return { errorMessage, fields };
};

export default validate;
