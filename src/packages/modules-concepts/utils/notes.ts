import { ConceptNotes } from '../../model/concepts/concept';
import { buildEmptyNotes } from '../../utils/build-empty-notes';
import { rawHtmlToRmesHtml } from '../../utils/html-utils';

export const versionableNotes: Array<keyof ConceptNotes> = [
	'scopeNoteLg1',
	'scopeNoteLg2',
	'definitionLg1',
	'definitionLg2',
	'editorialNoteLg1',
	'editorialNoteLg2',
];

export const datableNotes: Array<keyof ConceptNotes> = [
	'changeNoteLg1',
	'changeNoteLg2',
];

const allNotes = [...versionableNotes, ...datableNotes];

export const fields = allNotes;

export const emptyNotes = buildEmptyNotes(fields);

export const buildNotes = (n: ConceptNotes) => [
	{ lg1: n.scopeNoteLg1, lg2: n.scopeNoteLg2, title: 'conceptsScopeNote' },
	{ lg1: n.definitionLg1, lg2: n.definitionLg2, title: 'conceptsDefinition' },
	{
		lg1: n.editorialNoteLg1,
		lg2: n.editorialNoteLg2,
		title: 'conceptsEditorialNote',
	},
	{ lg1: n.changeNoteLg1, lg2: n.changeNoteLg2, title: 'conceptsChangeNote' },
];

export const capitalizeFirst = (str: string) =>
	str.charAt(0).toUpperCase() + str.slice(1);

export const processChanges = (
	oldNotes: ConceptNotes,
	notes: ConceptNotes,
	fields: Array<keyof ConceptNotes>,
) =>
	fields.reduce(
		(
			changes: { noteType: string; content: string }[],
			noteType: keyof ConceptNotes,
		) => {
			const oldContent = oldNotes[noteType];
			const content = notes[noteType];
			if (oldContent !== content)
				changes.push({
					noteType,
					//format the note the `rmes` way (with a wrapping div and a
					//namespace attribte).
					content: rawHtmlToRmesHtml(content ?? ''),
				});
			return changes;
		},
		[],
	);

export const processNotes = (
	notesToKeep: ConceptNotes,
	fields: Array<keyof ConceptNotes>,
) =>
	fields.reduce(
		(
			notes: { noteType: string; content: string }[],
			noteType: keyof ConceptNotes,
		) => {
			const content = notesToKeep[noteType];
			if (content)
				notes.push({
					noteType,
					//format the note the `rmes` way (with a wrapping div and a
					//namespace attribte).
					content: rawHtmlToRmesHtml(content),
				});
			return notes;
		},
		[],
	);

export const processVersionableChanges = (
	oldNotes: ConceptNotes,
	notes: ConceptNotes,
) => processChanges(oldNotes, notes, versionableNotes);

export const keepDatableNotes = (notes: ConceptNotes) =>
	processNotes(notes, datableNotes);

const versionImpactingNotes: Array<keyof ConceptNotes> = [
	'scopeNoteLg1',
	'definitionLg1',
	'editorialNoteLg1',
];

export const areNotesImpactingVersionChanged = (
	oldNotes: ConceptNotes,
	notes: ConceptNotes,
) => {
	return processChanges(oldNotes, notes, versionImpactingNotes).length > 0;
};
