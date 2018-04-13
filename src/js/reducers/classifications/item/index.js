import { getGeneral } from './general';
import { getNotes } from './notes';
import { getNarrowers } from './narrowers';

export function getItem(state, classificationId, itemId) {
	const general = getGeneral(
		state.classificationItemGeneral,
		classificationId,
		itemId
	);
	if (!general) return;
	const narrowers = getNarrowers(
		state.classificationItemNarrowers,
		classificationId,
		itemId
	);
	if (!narrowers) return;
	const notes = getNotes(
		state.classificationItemNotes,
		classificationId,
		itemId,
		general.conceptVersion
	);
	if (!notes) return { general, narrowers };
	return {
		general,
		notes,
		narrowers,
	};
}
