import api from 'js/remote-api/classifications-api';
import * as A from 'js/actions/constants';

export default id => dispatch => {
	dispatch({
		type: A.LOAD_CLASSIFICATIONS_FAMILLY_MEMBERS,
		payload: {
			id,
		},
	});
	return api.getFamilyMembers(id).then(
		results => {
			dispatch({
				type: A.LOAD_CLASSIFICATIONS_FAMILLY_MEMBERS_SUCCESS,
				payload: { id, results },
			});
			return results;
		},
		err =>
			dispatch({
				type: A.LOAD_CLASSIFICATIONS_FAMILLY_MEMBERS_FAILURE,
				payload: { err, id },
			})
	);
};
