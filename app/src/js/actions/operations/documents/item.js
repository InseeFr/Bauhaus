import api from 'js/remote-api/api';
import * as A from 'js/actions/constants';
import { LINK, DOCUMENT } from 'js/applications/operations/document/utils';

export const saveDocument = (document, type, files, callback) => dispatch => {
	dispatch({
		type: A.SAVE_OPERATIONS_DOCUMENT,
		payload: document,
	});
	const method = document.id
		? 'putDocument'
		: type === LINK
		? 'postLink'
		: 'postDocument';

	let body = document;

	/**
	 * If the document has no id, this is a creation
	 * We have to send FormData kind of HTTP request.
	 * Only File-type document has a file to upload
	 */
	if (!document.id) {
		const formData = new FormData();
		formData.append('body', JSON.stringify(document));

		if (type === DOCUMENT && files[0]) {
			formData.append('file', files[0], files[0].name);
		}
		body = formData;
	}

	let promise;
	if (type === DOCUMENT && document.id && files[0] && files[0].size) {
		const formData = new FormData();
		formData.append('file', files[0], files[0].name);
		promise = api.putDocumentFile(document, formData);
	} else {
		promise = api[method](body);
	}

	return promise.then(
		results => {
			dispatch({
				type: A.SAVE_OPERATIONS_DOCUMENT_SUCCESS,
				payload: {
					...document,
					id: document.id ? document.id : results,
				},
			});
			callback(null, results);
		},
		err => {
			dispatch({
				type: A.SAVE_OPERATIONS_DOCUMENT_FAILURE,
				payload: { err },
			});
			callback(err);
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
