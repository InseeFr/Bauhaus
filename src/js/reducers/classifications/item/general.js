import * as A from 'js/actions/constants';
import { LOADING, LOADED } from 'js/constants';
import * as generalUtils from 'js/utils/classifications/item/general';

export default function(state = {}, action) {
	const { type, payload } = action;
	switch (type) {
		case A.LOAD_CLASSIFICATION_ITEM_GENERAL:
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
		case A.LOAD_CLASSIFICATION_ITEM_GENERAL_SUCCESS: {
			const { classificationId, itemId, results } = payload;
			const otherItems = state[classificationId];
			return {
				...state,
				[classificationId]: {
					...otherItems,
					[itemId]: {
						status: LOADED,
						results: Object.assign(generalUtils.empty(), results),
					},
				},
			};
		}
		default:
			return state;
	}
}

export function getGeneral(state, classificationId, itemId) {
	return (
		state[classificationId] &&
		state[classificationId][itemId] &&
		state[classificationId][itemId].results
	);
}
