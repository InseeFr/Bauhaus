import * as A from 'js/actions/constants';
import { LOADED } from 'js/constants';

export default function(state = {}, action) {
	const { type, payload } = action;
	switch (type) {
		case A.LOAD_COLLECTION_MEMBERS_SUCCESS: {
			const { id, results } = payload;
			return {
				...state,
				[id]: {
					status: LOADED,
					results,
				},
			};
		}
		default:
			return state;
	}
}

export function getMembers(state, collectionId) {
	return state[collectionId] && state[collectionId].results;
}
