import { getGeneral } from './general';
import { getMembers } from './members';

/**
 * Returns the collection with the givend if everything (general, members) has
 * been loaded
 *
 * @export
 * @param {object} state
 * @param {string} id
 * @returns {object}
 */
export function getCollection(state, id) {
	const general = getGeneral(state.general, id);
	if (!general) return;
	const members = getMembers(state.members, id);
	if (!members) return;
	return {
		general,
		members,
	};
}
