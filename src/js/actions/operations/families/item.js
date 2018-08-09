import api from 'js/remote-api/operations-api';
import * as A from 'js/actions/constants';

export const saveFamily = family => dispatch => {
	dispatch({
		type: A.SAVE_OPERATIONS_FAMILY,
		payload: family,
	});
	return api.putFamily(family).then(
		results =>
			dispatch({
				type: A.SAVE_OPERATIONS_FAMILY_SUCCESS,
				payload: family,
			}),
		err =>
			dispatch({
				type: A.SAVE_OPERATIONS_FAMILY_FAILURE,
				payload: { err },
			})
	);
};
export default id => dispatch => {
	dispatch({
		type: A.LOAD_OPERATIONS_FAMILY,
		payload: {
			id,
		},
	});
	return api.getFamily(id).then(
		results =>
			dispatch({
				type: A.LOAD_OPERATIONS_FAMILY_SUCCESS,
				payload: results,
			}),
		err =>
			dispatch({
				type: A.LOAD_OPERATIONS_FAMILIES_LIST_FAILURE,
				payload: { err },
			})
	);
};
