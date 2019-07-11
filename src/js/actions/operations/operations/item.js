import api from 'js/remote-api/operations-api';
import * as A from 'js/actions/constants';
import { LOADING } from 'js/constants';
import { getItemFactory } from '../utils';

export const saveOperation = (operation, callback) => dispatch => {
	dispatch({
		type: A.SAVE_OPERATIONS_OPERATION,
		payload: operation,
	});
	const method = operation.id ? 'putOperation' : 'postOperation';

	return api[method](operation).then(
		results => {
			dispatch({
				type: A.SAVE_OPERATIONS_OPERATION_SUCCESS,
				payload: operation,
			});
			callback(null, results);
		},
		err => {
			dispatch({
				type: A.SAVE_OPERATIONS_OPERATION_FAILURE,
				payload: { err },
			});
			callback(err);
		}
	);
};

export default getItemFactory(
	api.getOperation,
	A.LOAD_OPERATIONS_OPERATION,
	A.LOAD_OPERATIONS_OPERATION_SUCCESS,
	A.LOAD_OPERATIONS_OPERATIONS_LIST_FAILURE
);
