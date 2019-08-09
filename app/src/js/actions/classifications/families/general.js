import api from 'js/remote-api/classifications-api';
import * as A from 'js/actions/constants';

export default id => dispatch => {
	dispatch({
		type: A.LOAD_CLASSIFICATIONS_FAMILLY_GENERAL,
		payload: {
			id,
		},
	});
	return api.getFamilyGeneral(id).then(
		results => {
			dispatch({
				type: A.LOAD_CLASSIFICATIONS_FAMILLY_GENERAL_SUCCESS,
				payload: { id, results },
			});
			return results;
		},
		err =>
			dispatch({
				type: A.LOAD_CLASSIFICATIONS_FAMILLY_GENERAL_FAILURE,
				payload: { err, id },
			})
	);
};
