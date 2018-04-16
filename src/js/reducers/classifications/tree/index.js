import * as A from 'js/actions/constants';
import { LOADING, LOADED } from 'js/constants';

export default function(state = {}, action) {
	const { type, payload } = action;
	switch (type) {
		case A.LOAD_CLASSIFICATION_TREE: {
			const { id } = payload;
			return {
				...state,
				[id]: { status: LOADING },
			};
		}
		case A.LOAD_CLASSIFICATION_TREE_SUCCESS: {
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

export function getTree(state, id) {
	return state.classificationTree[id] && state.classificationTree[id].results;
}
