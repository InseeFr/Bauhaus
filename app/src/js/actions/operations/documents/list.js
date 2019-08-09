import api from 'js/remote-api/api';
import * as A from 'js/actions/constants';
import { sortArray } from 'js/utils/array-utils';

const sortByLabel = sortArray('labelLg1');

export default () => dispatch => {
	dispatch({
		type: A.LOAD_OPERATIONS_DOCUMENTS,
		payload: {},
	});
	return api.getDocumentsList().then(
		results =>
			dispatch({
				type: A.LOAD_OPERATIONS_DOCUMENTS_SUCCESS,
				payload: {
					results: sortByLabel(
						results.map(doc => {
							return {
								...doc,
								id: doc.uri.substr(doc.uri.lastIndexOf('/') + 1),
							};
						})
					),
				},
			}),
		err => {
			dispatch({
				type: A.LOAD_OPERATIONS_DOCUMENTS_FAILURE,
				payload: { err },
			});
		}
	);
};
