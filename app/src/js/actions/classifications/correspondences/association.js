import api from 'js/remote-api/classifications-api';
import * as A from 'js/actions/constants';

export default (correspondenceId, associationId) => dispatch => {
	dispatch({
		type: A.LOAD_CLASSIFICATION_CORRESPONDENCE_ASSOCIATION,
		payload: {
			correspondenceId,
			associationId,
		},
	});
	return api.getCorrespondenceAssociation(correspondenceId, associationId).then(
		results => {
			dispatch({
				type: A.LOAD_CLASSIFICATION_CORRESPONDENCE_ASSOCIATION_SUCCESS,
				payload: { correspondenceId, associationId, results },
			});
			return results;
		},
		err =>
			dispatch({
				type: A.LOAD_CLASSIFICATION_CORRESPONDENCE_ASSOCIATION_FAILURE,
				payload: { err, correspondenceId, associationId },
			})
	);
};
