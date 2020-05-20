import { HTMLUtils } from 'bauhaus-utilities';
import D from 'js/i18n';

export const scndWithoutFirst = (first, second) => {
	return !HTMLUtils.htmlIsEmpty(second) && HTMLUtils.htmlIsEmpty(first);
};

export const checkPrefLabelLg1Existing = (
	concepts,
	prefLabelLg1,
	initialPrefLabelFr
) => {
	return (
		prefLabelLg1 !== initialPrefLabelFr &&
		concepts.map(concept => concept.label).indexOf(prefLabelLg1) !== -1
	);
};

export default (
	oldGeneral,
	newGeneral,
	notes,
	conceptsWithLinks,
	maxLengthScopeNote
) => {
	const isPrefLabelLg1Existing = checkPrefLabelLg1Existing(
		conceptsWithLinks,
		newGeneral.prefLabelLg1,
		oldGeneral.prefLabelLg1
	);

	if (isPrefLabelLg1Existing) {
		return D.duplicatedLabel;
	}

	const isMissingConcept = !(
		newGeneral.prefLabelLg1 &&
		newGeneral.creator &&
		newGeneral.disseminationStatus
	);

	if (isMissingConcept) {
		return D.incompleteConcept;
	}

	const isDefinitionLg1Empty = HTMLUtils.htmlIsEmpty(notes.definitionLg1);

	if (isDefinitionLg1Empty) {
		return D.emptyDefinitionLg1;
	}

	const isStatusPublicAndEmptyScopeNote =
		newGeneral.disseminationStatus.includes('Public') &&
		HTMLUtils.htmlIsEmpty(notes.scopeNoteLg1);

	if (isStatusPublicAndEmptyScopeNote) {
		return D.emptyScopeNoteLg1;
	}

	const hasScopeNoteLg2NotLg1 = scndWithoutFirst(
		notes.scopeNoteLg1,
		notes.scopeNoteLg2
	);

	if (hasScopeNoteLg2NotLg1) {
		return D.hasScopeNoteLg2NotLg1;
	}
	const isScopeNoteTooLong =
		HTMLUtils.htmlLength(notes.scopeNoteLg1) > maxLengthScopeNote ||
		HTMLUtils.htmlLength(notes.scopeNoteLg2) > maxLengthScopeNote;

	if (isScopeNoteTooLong) {
		return D.tooLongScopeNote(maxLengthScopeNote);
	}

	const hasEditorialNoteLg2NotLg1 = scndWithoutFirst(
		notes.editorialNoteLg1,
		notes.editorialNoteLg2
	);

	if (hasEditorialNoteLg2NotLg1) {
		return D.hasEditorialNoteLg2NotLg1;
	}

	const hasChangeNoteLg2NotLg1 = scndWithoutFirst(
		notes.changeNoteLg1,
		notes.changeNoteLg2
	);

	if (hasChangeNoteLg2NotLg1) {
		return D.hasChangeNoteLg2NotLg1;
	}
};
