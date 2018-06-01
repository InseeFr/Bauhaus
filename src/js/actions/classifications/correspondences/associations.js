import api from 'js/remote-api/classifications-api';
import * as A from 'js/actions/constants';

export default id => dispatch => {
	dispatch({
		type: A.LOAD_CLASSIFICATIONS_CORRESPONDENCE_ASSOCIATIONS,
		payload: {
			id,
		},
	});
	return api.getCorrespondenceAssociations(id).then(
		results => {
			dispatch({
				type: A.LOAD_CLASSIFICATIONS_CORRESPONDENCE_ASSOCIATIONS_SUCCESS,
				payload: { id, results },
			});
			return results;
		},
		err =>
			dispatch({
				type: A.LOAD_CLASSIFICATIONS_CORRESPONDENCE_ASSOCIATIONS_FAILURE,
				payload: { err, id },
			})
	);
};
