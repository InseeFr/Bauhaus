import api from 'js/remote-api/operations-api';
import * as A from 'js/actions/constants';

export const saveFamily = (family, callback) => dispatch => {
	dispatch({
		type: A.SAVE_OPERATIONS_FAMILY,
		payload: family,
	});
	const method = family.id ? 'putFamily' : 'postFamily';
	return api[method](family).then(
		results => {
			dispatch({
				type: A.SAVE_OPERATIONS_FAMILY_SUCCESS,
				payload: family,
			});
			callback(results);
		},
		err => {
			dispatch({
				type: A.SAVE_OPERATIONS_FAMILY_FAILURE,
				payload: { err },
			});
			callback();
		}
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
