import PropTypes from 'prop-types';
import objectFromKeys from 'js/utils/object-from-keys';

const fieldsToTrack = [
	'definitionCourteFr',
	'definitionCourteEn',
	'definitionFr',
	'definitionEn',
	'noteEditorialeFr',
	'noteEditorialeEn',
	'changeNoteFr',
	'changeNoteEn',
];

const fieldsVersion = [
	'definitionCourteFrVersion',
	'definitionCourteEnVersion',
	'definitionFrVersion',
	'definitionEnVersion',
	'noteEditorialeFrVersion',
	'noteEditorialeEnVersion',
	'changeNoteFrVersion',
	'changeNoteEnVersion',
];

export const fields = [...fieldsToTrack, ...fieldsVersion];

export const processChanges = (oldNotes, newNotes) =>
	fieldsToTrack.reduce((changes, field) => {
		changes[`${field}Changed`] = oldNotes[field] !== newNotes[field];
		return changes;
	}, {});

export const areNotesChanged = (oldNotes, newNotes) => {
	const {
		isDefinitionCourteFrChanged,
		isDefinitionFrChanged,
		isNoteEditorialeFrChanged,
	} = processChanges(oldNotes, newNotes);

	//TODO check what `objectSize` what used for
	return (
		isDefinitionCourteFrChanged ||
		isDefinitionFrChanged ||
		isNoteEditorialeFrChanged
	);
};

export const propTypes = PropTypes.shape(
	objectFromKeys(fields, PropTypes.string)
);
