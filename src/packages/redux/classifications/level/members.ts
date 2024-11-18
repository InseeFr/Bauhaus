import { LOADED, LOADING } from '@sdk/constants';
import {
	LOAD_CLASSIFICATION_LEVEL_MEMBERS,
	LOAD_CLASSIFICATION_LEVEL_MEMBERS_SUCCESS,
} from '../../actions/constants';
import { ReduxAction } from '../../model';

const membersReducer = (state: any = {}, action: ReduxAction) => {
	const { type, payload } = action;
	switch (type) {
		case LOAD_CLASSIFICATION_LEVEL_MEMBERS: {
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
		case LOAD_CLASSIFICATION_LEVEL_MEMBERS_SUCCESS: {
			const { classificationId, levelId, results } = payload;
			const otherLevels = state[classificationId];
			return {
				...state,
				[classificationId]: {
					...otherLevels,
					[levelId]: {
						status: LOADED,
						results,
					},
				},
			};
		}
		default:
			return state;
	}
};

export default membersReducer;

export function getMembers(
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
