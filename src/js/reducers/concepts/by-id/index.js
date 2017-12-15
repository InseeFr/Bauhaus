import { getGeneral } from './general';
import { getNotes } from './notes';
import { getLinks } from './links';

/**
 * Returns the concept with the givend if everything (general, notes, links) has
 * been loaded
 *
 * @export
 * @param {object} state
 * @param {string} id
 * @returns {object}
 */
export function getConcept(state, id) {
	const general = getGeneral(state.general, id);
	if (!general) return;
	const notes = getNotes(state.notes, id, general.conceptVersion);
	if (!notes) return;
	const links = getLinks(state.links, id);
	if (!links) return;
	return {
		general,
		notes,
		links,
	};
}
