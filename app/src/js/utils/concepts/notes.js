import PropTypes from 'prop-types';
import { objectFromKeys, buildEmptyNotes } from '@inseefr/wilco';
import { rawHtmlToRmesHtml } from 'js/utils/html';

export const versionableNotes = [
	'scopeNoteLg1',
	'scopeNoteLg2',
	'definitionLg1',
	'definitionLg2',
	'editorialNoteLg1',
	'editorialNoteLg2',
];

export const datableNotes = ['changeNoteLg1', 'changeNoteLg2'];

const allNotes = [...versionableNotes, ...datableNotes];

export const fields = allNotes;

export const emptyNotes = buildEmptyNotes(fields);

export const buildNotes = n => [
	{ lg1: n.scopeNoteLg1, lg2: n.scopeNoteLg2, title: 'conceptsScopeNote' },
	{ lg1: n.definitionLg1, lg2: n.definitionLg2, title: 'conceptsDefinition' },
	{
		lg1: n.editorialNoteLg1,
		lg2: n.editorialNoteLg2,
		title: 'conceptsEditorialNote',
	},
	{ lg1: n.changeNoteLg1, lg2: n.changeNoteLg2, title: 'conceptsChangeNote' },
];

export const capitalizeFirst = str =>
	str.charAt(0).toUpperCase() + str.slice(1);

export const createNotes = notes => {};

export const processChanges = (oldNotes, notes, fields) =>
	fields.reduce((changes, noteType) => {
		const oldContent = oldNotes[noteType];
		const content = notes[noteType];
		if (oldContent !== content)
			changes.push({
				noteType,
				//format the note the `rmes` way (with a wrapping div and a
				//namespace attribte).
				content: rawHtmlToRmesHtml(content),
			});
		return changes;
	}, []);

export const processNotes = (notesToKeep, fields) =>
	fields.reduce((notes, noteType) => {
		const content = notesToKeep[noteType];
		if (content)
			notes.push({
				noteType,
				//format the note the `rmes` way (with a wrapping div and a
				//namespace attribte).
				content: rawHtmlToRmesHtml(content),
			});
		return notes;
	}, []);

export const processVersionableChanges = (oldNotes, notes) =>
	processChanges(oldNotes, notes, versionableNotes);
export const processDatableChanges = (oldNotes, notes) =>
	processChanges(oldNotes, notes, datableNotes);
export const processAllChanges = (oldNotes, notes) =>
	processChanges(oldNotes, notes, allNotes);
export const keepDatableNotes = notes => processNotes(notes, datableNotes);

const versionImpactingNotes = [
	'scopeNoteLg1',
	'definitionLg1',
	'editorialNoteLg1',
];

export const areNotesImpactingVersionChanged = (oldNotes, notes) => {
	return processChanges(oldNotes, notes, versionImpactingNotes).length > 0;
};

export const propTypes = PropTypes.shape(
	objectFromKeys(fields, PropTypes.string)
);
