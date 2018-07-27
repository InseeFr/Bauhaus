import api from 'js/remote-api/operations-api';
import * as A from 'js/actions/constants';

export default notation => dispatch => {
	dispatch({
		type: A.LOAD_OPERATIONS_CODES_LIST,
		payload: {},
	});
	return api.getCodesList(notation).then(
		results =>
			dispatch({
				type: A.LOAD_OPERATIONS_CODES_LIST_SUCCESS,
				payload: results,
			}),
		err =>
			dispatch({
				type: A.LOAD_OPERATIONS_CODES_LIST_FAILURE,
				payload: { err },
			})
	);
};
