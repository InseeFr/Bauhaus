import { processLinks, processGeneral } from './shared';

import {
	processVersionableChanges,
	keepDatableNotes,
} from '../../../utils/concepts/notes';
import { CLOSE_MATCH, VERSIONING } from '../../../constants';

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

export default function buildPayloadUpdate(versioning, oldConcept, concept) {
	const { notes: oldNotes } = oldConcept;
	const { general: rawGeneral, notes, conceptsWithLinks } = concept;

	const general = processGeneral(rawGeneral, generalFieldsToKeep);
	const links = [...processLinks(conceptsWithLinks)];
	if (concept.equivalentLinks?.length > 0) {
		links.push(
			concept.equivalentLinks.reduce(
				(acc, link) => ({
					typeOfLink: CLOSE_MATCH,
					urn: [...acc.urn, link.urn],
				}),
				{ urn: [] }
			)
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
