import { LOADED, LOADING, ERROR, NOT_LOADED } from 'js/constants';
import {
	LOAD_OPERATIONS_DOCUMENTS,
	LOAD_OPERATIONS_DOCUMENTS_SUCCESS,
	LOAD_OPERATIONS_DOCUMENTS_FAILURE,
} from 'js/actions/constants/operations/documents';

/**
 *
 * @param {SimsDoc} state
 * @param {*} action
 */
export const operationsDocuments = function(
	state = { status: NOT_LOADED },
	action
) {
	switch (action.type) {
		case LOAD_OPERATIONS_DOCUMENTS:
			return {
				status: LOADING,
			};
		case LOAD_OPERATIONS_DOCUMENTS_SUCCESS:
			return {
				status: LOADED,
				results: action.payload.results,
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
