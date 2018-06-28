import api from 'js/remote-api/operations-api';
import * as A from 'js/actions/constants';

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
				type: A.LOAD_OPERATIONS_OPERATIONS_LIST_SUCCESS,
				payload: {
					results: [
						{
							...results,
							id,
						},
					],
				},
			}),
		err =>
			dispatch({
				type: A.LOAD_OPERATIONS_OPERATIONS_LIST_FAILURE,
				payload: { err },
			})
	);
};
