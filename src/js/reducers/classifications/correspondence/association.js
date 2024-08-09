import * as A from '../../../actions/constants';
import { LOADED, LOADING } from '../../../new-architecture/sdk/constants';
import * as associationUtils from '../../../applications/classifications/utils/correspondence/association';

const reducers = (state = {}, action) => {
	const { type, payload } = action;
	switch (type) {
		case A.LOAD_CLASSIFICATION_CORRESPONDENCE_ASSOCIATION: {
			const { correspondenceId, associationId } = payload;
			const otherAssociation = state[correspondenceId];
			return {
				...state,
				[correspondenceId]: {
					...otherAssociation,
					[associationId]: {
						status: LOADING,
					},
				},
			};
		}
		case A.LOAD_CLASSIFICATION_CORRESPONDENCE_ASSOCIATION_SUCCESS: {
			const { correspondenceId, associationId, results } = payload;
			const otherAssociation = state[correspondenceId];
			return {
				...state,
				[correspondenceId]: {
					...otherAssociation,
					[associationId]: {
						status: LOADED,
						results: Object.assign(associationUtils.empty(), results),
					},
				},
			};
		}
		default:
			return state;
	}
};

export default reducers;
export const getAssociation = (state, correspondenceId, associationId) =>
	state.classificationsCorrespondenceAssociation[correspondenceId] &&
	state.classificationsCorrespondenceAssociation[correspondenceId][
		associationId
	] &&
	state.classificationsCorrespondenceAssociation[correspondenceId][
		associationId
	].results;
