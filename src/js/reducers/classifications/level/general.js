import * as A from 'js/actions/constants';
import { LOADING, LOADED } from 'js/constants';
import * as generalUtils from 'js/applications/classifications/utils/level/general';

export default function(state = {}, action) {
	const { type, payload } = action;
	switch (type) {
		case A.LOAD_CLASSIFICATION_LEVEL_GENERAL:
			const { classificationId, levelId } = payload;
			const otherLevels = state[classificationId];
			return {
				...state,
				[classificationId]: {
					...otherLevels,
					[levelId]: {
						status: LOADING,
					},
				},
			};
		case A.LOAD_CLASSIFICATION_LEVEL_GENERAL_SUCCESS: {
			const { classificationId, levelId, results } = payload;
			const otherLevels = state[classificationId];
			return {
				...state,
				[classificationId]: {
					...otherLevels,
					[levelId]: {
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

export function getGeneral(state, classificationId, levelId) {
	return (
		state[classificationId] &&
		state[classificationId][levelId] &&
		state[classificationId][levelId].results
	);
}
