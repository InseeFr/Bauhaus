import api from 'js/remote-api/codelist-api';
import * as A from 'js/actions/constants';

export default (notations, store) => {
	notations.forEach(notation => {
		return api.getCodesList(notation).then(
			results =>
				store.dispatch({
					type: A.LOAD_OPERATIONS_CODES_LIST_SUCCESS,
					payload: results,
				}),
			err =>
				store.dispatch({
					type: A.LOAD_OPERATIONS_CODES_LIST_FAILURE,
					payload: { err },
				})
		);
	});
};
