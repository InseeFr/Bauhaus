import api from 'js/remote-api/api';
import * as A from '../constants';

export default data => dispatch => {
	dispatch({
		type: A.ADD_ROLE,
		payload: {
			data,
		},
	});
	return api.postAddRole(data).then(
		res =>
			dispatch({
				type: A.ADD_ROLE_SUCCESS,
				payload: { data },
			}),
		err =>
			dispatch({
				type: A.ADD_ROLE_FAILURE,
				payload: { err, data },
			})
	);
};
