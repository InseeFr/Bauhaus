import api from 'js/remote-api/api';
import * as A from 'js/actions/constants';

export default id => dispatch => {
	dispatch({
		type: A.LOAD_OPERATIONS_DOCUMENT,
		payload: {
			id,
		},
	});
	/**
	 * @param {{ uri: { substr: (arg0: any) => void; lastIndexOf: (arg0: string) => number; }; }} results
	 */
	/**
	 * @param {any} err
	 */
	return api.getDocument(id).then(
		results =>
			dispatch({
				type: A.LOAD_OPERATIONS_DOCUMENT_SUCCESS,
				payload: {
					...results,
					id: results.uri.substr(results.uri.lastIndexOf('/') + 1),
				},
			}),
		err =>
			dispatch({
				type: A.LOAD_OPERATIONS_DOCUMENT_FAILURE,
				payload: { err },
			})
	);
};
