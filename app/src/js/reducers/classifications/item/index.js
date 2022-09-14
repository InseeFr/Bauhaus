import { getGeneral } from './general';
import { getNotes, getAllNotes } from './notes';

export function getItem(state, classificationId, itemId) {
	const general = getGeneral(
		state.classificationItemGeneral,
		classificationId,
		itemId
	);
	if (!general) return;

	const notes = getNotes(
		state.classificationItemNotes,
		classificationId,
		itemId,
		general.conceptVersion
	);
	if (!notes) return { general };
	return {
		general,
		notes,
	};
}

export function getFullItem(state, classificationId, itemId) {
	const general = getGeneral(
		state.classificationItemGeneral,
		classificationId,
		itemId
	);
	if (!general) return;
	const notes = getAllNotes(
		state.classificationItemNotes,
		classificationId,
		itemId,
		general.conceptVersion
	);
	if (!notes) return;
	return {
		general,
		notes,
	};
}
