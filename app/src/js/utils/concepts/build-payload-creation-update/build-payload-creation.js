import { processLinks, processGeneral } from './shared';
import { takeKeys } from '@inseefr/wilco';
import { rawHtmlToRmesHtml } from 'js/utils/html';

const generalFieldsToKeep = [
	'prefLabelLg1',
	'prefLabelLg2',
	'altLabelLg1',
	'altLabelLg2',
	'creator',
	'contributor',
	'disseminationStatus',
	'additionalMaterial',
	'valid',
];

const extractVersNotes = takeKeys([
	'scopeNoteLg1',
	'scopeNoteLg2',
	'definitionLg1',
	'definitionLg2',
	'editorialNoteLg1',
	'editorialNoteLg2',
]);

export default function buildPayloadCreation(concept) {
	const { general: rawGeneral, notes, conceptsWithLinks } = concept;

	const general = processGeneral(rawGeneral, generalFieldsToKeep);
	const links = processLinks(conceptsWithLinks);

	const versNotesObj = extractVersNotes(notes);

	const versionableNotes = Object.keys(versNotesObj).reduce((arr, noteType) => {
		const content = versNotesObj[noteType];
		if (content)
			arr.push({
				noteType,
				content: rawHtmlToRmesHtml(content),
			});
		return arr;
	}, []);

	const datableNotes = ['changeNoteLg1', 'changeNoteLg2']
		.map(noteType => {
			const content = notes[noteType];
			if (content)
				return {
					noteType,
					content: rawHtmlToRmesHtml(content),
				};
			return null;
		})
		//remove empty notes
		.filter(note => note);

	return {
		...general,
		versionableNotes,
		datableNotes,
		links,
	};
}
