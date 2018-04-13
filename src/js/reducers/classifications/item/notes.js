import * as A from 'js/actions/constants';
import { LOADING, LOADED } from 'js/constants';
import { range } from 'js/utils/array-utils';

export default function(state = {}, action) {
	const { type, payload } = action;
	switch (type) {
		//TODO don't load twice the same resource
		case A.LOAD_CLASSIFICATION_ITEM_NOTES_VERSION:
			const { classificationId, itemId, version } = payload;
			const otherItems = state[classificationId];
			const otherVersions = state[classificationId]
				? state[classificationId][itemId]
				: {};
			return {
				...state,
				[classificationId]: {
					...otherItems,
					[itemId]: {
						...otherVersions,
						[version]: {
							status: LOADING,
						},
					},
				},
			};
		case A.LOAD_CLASSIFICATION_ITEM_NOTES_VERSION_SUCCESS: {
			const { classificationId, itemId, version, results } = payload;
			const otherItems = state[classificationId];
			const otherVersions = state[classificationId]
				? state[classificationId][itemId]
				: {};
			return {
				...state,
				[classificationId]: {
					...otherItems,
					[itemId]: {
						...otherVersions,
						[version]: {
							status: LOADED,
							results,
						},
					},
				},
			};
		}
		default:
			return state;
	}
}

export const getNotes = (state, classificationId, itemId, conceptVersion) => {
	let allNotes = state[classificationId];
	if (!allNotes) return null;
	allNotes = allNotes[itemId];
	if (!allNotes) return null;
	const versionNotes = allNotes[conceptVersion];
	return versionNotes && versionNotes.results;
};

export const getAllNotes = (state, classificationId, itemId, lastVersion) => {
	let allNotes = state[classificationId];
	if (!allNotes) return null;
	allNotes = allNotes[itemId];
	if (!allNotes) return null;
	const notes = Object.keys(allNotes).reduce((notes, version) => {
		const notesVersion = allNotes[version];
		if (notesVersion && notesVersion.results)
			notes[version] = notesVersion.results;
		return notes;
	}, {});
	const versions = range(1, Number(lastVersion) + 1);
	//return notes only if each expected version is present
	if (versions.every(version => version in notes)) {
		return notes;
	}
};
