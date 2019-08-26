import * as A from 'js/actions/constants';
import { LOADED, LOADING } from 'js/constants';
import * as associationUtils from 'js/utils/classifications/correspondence/association';

export default function(state = {}, action) {
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
}

export const getAssociation = (state, correspondenceId, associationId) =>
	state.classificationsCorrespondenceAssociation[correspondenceId] &&
	state.classificationsCorrespondenceAssociation[correspondenceId][
		associationId
	] &&
	state.classificationsCorrespondenceAssociation[correspondenceId][
		associationId
	].results;
