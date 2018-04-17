import * as A from 'js/actions/constants';
import { LOADING, LOADED } from 'js/constants';

export default function(state = {}, action) {
	const { type, payload } = action;
	switch (type) {
		case A.LOAD_CLASSIFICATION_ITEMS: {
			const { id } = payload;
			return {
				...state,
				[id]: { status: LOADING },
			};
		}
		case A.LOAD_CLASSIFICATION_ITEMS_SUCCESS: {
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

export function getItems(state, id) {
	return state.classificationItems[id] && state.classificationItems[id].results;
}
