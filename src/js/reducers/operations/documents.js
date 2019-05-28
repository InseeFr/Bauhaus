import { LOADED, LOADING, ERROR, NOT_LOADED } from 'js/constants';
import {
	LOAD_OPERATIONS_DOCUMENTS,
	LOAD_OPERATIONS_DOCUMENTS_SUCCESS,
	LOAD_OPERATIONS_DOCUMENTS_FAILURE,
} from 'js/actions/constants/operations/documents';
import { isDocument } from 'js/components/operations/document/utils';
/**
 *
 * @param {SimsDoc} state
 * @param {*} action
 */
export const operationsDocuments = function(
	state = { status: NOT_LOADED, results: {} },
	action
) {
	switch (action.type) {
		case LOAD_OPERATIONS_DOCUMENTS:
			return {
				status: LOADING,
			};
		case LOAD_OPERATIONS_DOCUMENTS_SUCCESS:
			const full = action.payload.results;
			const [documents, links] = full.reduce(
				(acc, element) => {
					acc[isDocument(element) ? 0 : 1].push(element);
					return acc;
				},
				[[], []]
			);
			return {
				status: LOADED,
				results: {
					full,
					documents,
					links,
				},
			};
		case LOAD_OPERATIONS_DOCUMENTS_FAILURE:
			return {
				status: ERROR,
				err: action.payload.err,
			};
		default:
			return state;
	}
};
