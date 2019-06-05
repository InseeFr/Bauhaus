import { LOADED, LOADING, ERROR, NOT_LOADED } from 'js/constants';
import {
	LOAD_OPERATIONS_DOCUMENTS,
	LOAD_OPERATIONS_DOCUMENTS_SUCCESS,
	LOAD_OPERATIONS_DOCUMENTS_FAILURE,
	LOAD_OPERATIONS_DOCUMENT,
	LOAD_OPERATIONS_DOCUMENT_SUCCESS,
	LOAD_OPERATIONS_DOCUMENT_FAILURE,
	SAVE_OPERATIONS_DOCUMENT_SUCCESS,
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
		case SAVE_OPERATIONS_DOCUMENT_SUCCESS:
			return {};
		default:
			return state;
	}
};

export const operationsCurrentDocument = function(
	state = { status: NOT_LOADED, results: {} },
	action
) {
	switch (action.type) {
		case LOAD_OPERATIONS_DOCUMENT:
			return {
				status: LOADING,
			};
		case LOAD_OPERATIONS_DOCUMENT_SUCCESS:
			return {
				status: LOADED,
				results: action.payload,
			};
		case LOAD_OPERATIONS_DOCUMENT_FAILURE:
			return {
				status: ERROR,
				err: action.payload.err,
			};
		case SAVE_OPERATIONS_DOCUMENT_SUCCESS:
			return {};
		default:
			return state;
	}
};
