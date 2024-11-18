import { processLinks, processGeneral } from './shared';

import { processVersionableChanges, keepDatableNotes } from '../notes';
import { CLOSE_MATCH, VERSIONING } from '@sdk/constants';

//only `isValidated` is not sent
const generalFieldsToKeep = [
	'prefLabelLg1',
	'prefLabelLg2',
	'altLabelLg1',
	'altLabelLg2',
	'creator',
	'created',
	'contributor',
	'disseminationStatus',
	'additionalMaterial',
	'valid',
];

export default function buildPayloadUpdate(
	versioning: any,
	oldConcept: any,
	concept: any,
) {
	const { notes: oldNotes } = oldConcept;
	const { general: rawGeneral, notes, conceptsWithLinks } = concept;

	const general = processGeneral(rawGeneral, generalFieldsToKeep);
	const links: any[] = [...processLinks(conceptsWithLinks)];
	if (concept.equivalentLinks?.length > 0) {
		links.push(
			concept.equivalentLinks.reduce(
				(acc: any, link: any) => ({
					typeOfLink: CLOSE_MATCH,
					urn: [...acc.urn, link.urn],
				}),
				{ urn: [] },
			),
		);
	}

	return {
		versioning: versioning === VERSIONING ? true : false,
		...general, //prefLabelLg1, prefLabelLg2...
		links,
		datableNotes: keepDatableNotes(notes),
		versionableNotes: processVersionableChanges(oldNotes, notes),
	};
}
