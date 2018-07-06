import api from 'js/remote-api/classifications-api';
import * as A from 'js/actions/constants';

export default id => dispatch => {
	dispatch({
		type: A.LOAD_CLASSIFICATION_CORRESPONDENCE_GENERAL,
		payload: {
			id,
		},
	});
	return api.getCorrespondenceGeneral(id).then(
		results => {
			dispatch({
				type: A.LOAD_CLASSIFICATION_CORRESPONDENCE_GENERAL_SUCCESS,
				payload: { id, results },
			});
			return results;
		},
		err =>
			dispatch({
				type: A.LOAD_CLASSIFICATION_CORRESPONDENCE_GENERAL_FAILURE,
				payload: { err, id },
			})
	);
};
