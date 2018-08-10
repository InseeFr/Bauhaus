import api from 'js/remote-api/operations-api';
import * as A from 'js/actions/constants';

export const saveOperation = operation => dispatch => {
	dispatch({
		type: A.SAVE_OPERATIONS_OPERATION,
		payload: operation,
	});
	return api.putOperation(operation).then(
		results =>
			dispatch({
				type: A.SAVE_OPERATIONS_OPERATION_SUCCESS,
				payload: operation,
			}),
		err =>
			dispatch({
				type: A.SAVE_OPERATIONS_OPERATION_FAILURE,
				payload: { err },
			})
	);
};

export default id => dispatch => {
	dispatch({
		type: A.LOAD_OPERATIONS_OPERATION,
		payload: {
			id,
		},
	});
	return api.getOperation(id).then(
		results =>
			dispatch({
				type: A.LOAD_OPERATIONS_OPERATION_SUCCESS,
				payload: results,
			}),
		err =>
			dispatch({
				type: A.LOAD_OPERATIONS_OPERATIONS_LIST_FAILURE,
				payload: { err },
			})
	);
};
