import * as A from 'js/actions/constants';
import { LOADED } from 'js/constants';

export default function(state = {}, action) {
	const { type, payload } = action;
	switch (type) {
		case A.LOAD_CLASSIFICATION_CORRESPONDENCE_ASSOCIATIONS_SUCCESS: {
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

export function getAssociations(state, id) {
	return state[id] && state[id].results;
}
