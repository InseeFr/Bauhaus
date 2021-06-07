import * as A from 'js/actions/constants';
import { LOADING, LOADED } from 'js/constants';
import { ArrayUtils } from 'bauhaus-utilities';

export default function(state = {}, action) {
	const { type, payload } = action;
	switch (type) {
		case A.DELETE_CONCEPT_SUCCESS: {
			const { id } = payload;
			return {
				...state,
				[id]: {},
			};
		}
		case A.LOAD_NOTES_VERSION:
			const { id, version } = payload;
			const otherVersions = state[id];
			return {
				...state,
				[id]: {
					...otherVersions,
					[version]: {
						status: LOADING,
					},
				},
			};
		case A.LOAD_NOTES_VERSION_SUCCESS: {
			const { id, version, results } = payload;
			const otherVersions = state[id];
			return {
				...state,
				[id]: {
					//on conserve les versions déjà chargées
					...otherVersions,
					//on ajoute la nouvelle version
					[version]: {
						status: LOADED,
						results,
					},
				},
			};
		}
		default:
			return state;
	}
}

export const getNotes = (state, conceptId, conceptVersion) => {
	const allNotes = state[conceptId];
	if (!allNotes) return null;
	const versionNotes = allNotes[conceptVersion];
	return versionNotes && versionNotes.results;
};

export const getAllNotes = (state, conceptId, lastVersion) => {
	const allNotes = state[conceptId];
	if (!allNotes) return null;
	const notes = Object.keys(allNotes).reduce((notes, version) => {
		const notesVersion = allNotes[version];
		if (notesVersion && notesVersion.results)
			notes[version] = notesVersion.results;
		return notes;
	}, {});
	const versions = ArrayUtils.range(1, Number(lastVersion) + 1);
	//return notes only if each expected version is present
	if (versions.every(version => version in notes)) {
		return notes;
	}
};
