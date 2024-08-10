import * as generalUtils from '../../../../applications/classifications/utils/level/general';
import {
	LOAD_CLASSIFICATION_LEVEL_GENERAL,
	LOAD_CLASSIFICATION_LEVEL_GENERAL_SUCCESS,
} from '../../../../actions/constants';
import { LOADED, LOADING } from '../../../sdk/constants';

const reducers = (state: any = {}, action: any) => {
	const { type, payload } = action;
	switch (type) {
		case LOAD_CLASSIFICATION_LEVEL_GENERAL:
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
		case LOAD_CLASSIFICATION_LEVEL_GENERAL_SUCCESS: {
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

export function getGeneral(
	state: any,
	classificationId: string,
	levelId: string
) {
	return (
		state[classificationId] &&
		state[classificationId][levelId] &&
		state[classificationId][levelId].results
	);
}
