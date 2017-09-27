import api from 'js/remote-api/api';
import * as A from '../constants';

export default data => dispatch => {
	dispatch({
		type: A.DELETE_ROLE,
		payload: {
			data,
		},
	});
	return api.postDeleteRole(data).then(
		res =>
			dispatch({
				type: A.DELETE_ROLE_SUCCESS,
				payload: { data },
			}),
		err =>
			dispatch({
				type: A.DELETE_ROLE_FAILURE,
				payload: { err, data },
			})
	);
};
