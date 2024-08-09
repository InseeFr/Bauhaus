import * as A from '../../../actions/constants';
import { LOADING, LOADED } from '../../../new-architecture/sdk/constants';
import * as generalUtils from '../../../applications/classifications/utils/level/general';

const reducers = (state = {}, action) => {
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
};

export default reducers;

export function getGeneral(state, classificationId, levelId) {
	return (
		state[classificationId] &&
		state[classificationId][levelId] &&
		state[classificationId][levelId].results
	);
}
