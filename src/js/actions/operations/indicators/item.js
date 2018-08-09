import api from 'js/remote-api/operations-api';
import * as A from 'js/actions/constants';

export const saveIndicator = indicator => dispatch => {
	dispatch({
		type: A.SAVE_OPERATIONS_INDICATOR,
		payload: indicator,
	});

	return api.putIndicator(indicator).then(
		results =>
			dispatch({
				type: A.SAVE_OPERATIONS_INDICATOR_SUCCESS,
				payload: indicator,
			}),
		err =>
			dispatch({
				type: A.SAVE_OPERATIONS_INDICATOR_FAILURE,
				payload: { err },
			})
	);
};

export default id => dispatch => {
	dispatch({
		type: A.LOAD_OPERATIONS_INDICATOR,
		payload: {
			id,
		},
	});
	return api.getIndicator(id).then(
		results =>
			dispatch({
				type: A.LOAD_OPERATIONS_INDICATOR_SUCCESS,
				payload: results,
			}),
		err =>
			dispatch({
				type: A.LOAD_OPERATIONS_INDICATORS_LIST_FAILURE,
				payload: { err },
			})
	);
};
