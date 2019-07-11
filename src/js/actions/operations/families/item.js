import api from 'js/remote-api/operations-api';
import * as A from 'js/actions/constants';
import { getItemFactory } from '../utils';

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
				payload: {
					...family,
					id: family.id ? family.id : results,
				},
			});
			callback(null, results);
		},
		err => {
			dispatch({
				type: A.SAVE_OPERATIONS_FAMILY_FAILURE,
				payload: { err },
			});
			callback(err);
		}
	);
};
export default getItemFactory(
	api.getFamily,
	A.LOAD_OPERATIONS_FAMILY,
	A.LOAD_OPERATIONS_FAMILY_SUCCESS,
	A.LOAD_OPERATIONS_FAMILIES_LIST_FAILURE
);
