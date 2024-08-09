import * as A from '../../../actions/constants';
import { LOADING, LOADED } from '../../../new-architecture/sdk/constants';

const membersReducer = (state = {}, action) => {
	const { type, payload } = action;
	switch (type) {
		case A.LOAD_CLASSIFICATION_LEVEL_MEMBERS:
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
		case A.LOAD_CLASSIFICATION_LEVEL_MEMBERS_SUCCESS: {
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

export function getMembers(state, classificationId, levelId) {
	return (
		state[classificationId] &&
		state[classificationId][levelId] &&
		state[classificationId][levelId].results
	);
}
