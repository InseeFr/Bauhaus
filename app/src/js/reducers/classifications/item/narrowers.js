import * as A from 'js/actions/constants';
import { LOADING, LOADED } from 'js/constants';

export default function(state = {}, action) {
	const { type, payload } = action;
	switch (type) {
		case A.LOAD_CLASSIFICATION_ITEM_NARROWERS:
			const { classificationId, itemId } = payload;
			const otherItems = state[classificationId];
			return {
				...state,
				[classificationId]: {
					...otherItems,
					[itemId]: {
						status: LOADING,
					},
				},
			};
		case A.LOAD_CLASSIFICATION_ITEM_NARROWERS_SUCCESS: {
			const { classificationId, itemId, results } = payload;
			const otherItems = state[classificationId];
			return {
				...state,
				[classificationId]: {
					...otherItems,
					[itemId]: {
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

export function getNarrowers(state, classificationId, itemId) {
	return (
		state[classificationId] &&
		state[classificationId][itemId] &&
		state[classificationId][itemId].results
	);
}
