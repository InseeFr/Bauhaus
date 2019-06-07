import api from 'js/remote-api/api';
import * as A from 'js/actions/constants';

export const saveDocument = (document, callback) => dispatch => {
	dispatch({
		type: A.SAVE_OPERATIONS_DOCUMENT,
		payload: document,
	});
	const method = document.id ? 'putDocument' : 'postLink';
	let body = document;
	if (!document.id) {
		const formData = new FormData();
		formData.append('body', JSON.stringify(document));
		body = formData;
	}
	return api[method](body).then(
		results => {
			dispatch({
				type: A.SAVE_OPERATIONS_DOCUMENT_SUCCESS,
				payload: {
					...document,
					id: document.id ? document.id : results,
				},
			});
			callback(results);
		},
		err => {
			dispatch({
				type: A.SAVE_OPERATIONS_DOCUMENT_FAILURE,
				payload: { err },
			});
			callback();
		}
	);
};
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
