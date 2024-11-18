import * as generalUtils from '../../../modules-classifications/utils/level/general';

import { LOADED, LOADING } from '@sdk/constants';
import {
	LOAD_CLASSIFICATION_LEVEL_GENERAL,
	LOAD_CLASSIFICATION_LEVEL_GENERAL_SUCCESS,
} from '../../actions/constants';
import { ReduxAction } from '../../model';

const reducers = (state: any = {}, action: ReduxAction) => {
	const { type, payload } = action;
	switch (type) {
		case LOAD_CLASSIFICATION_LEVEL_GENERAL: {
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
		}
		case LOAD_CLASSIFICATION_LEVEL_GENERAL_SUCCESS: {
			const { classificationId, levelId, results } = payload;
			const otherLevels = state[classificationId];
			return {
				...state,
				[classificationId]: {
					...otherLevels,
					[levelId]: {
						status: LOADED,
						results: { ...generalUtils.empty(), ...results },
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
	levelId: string,
) {
	return (
		state[classificationId] &&
		state[classificationId][levelId] &&
		state[classificationId][levelId].results
	);
}
