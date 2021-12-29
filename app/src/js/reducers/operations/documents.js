import { LOADED, LOADING, ERROR, NOT_LOADED } from 'js/constants';
import {
	LOAD_OPERATIONS_DOCUMENT,
	LOAD_OPERATIONS_DOCUMENT_SUCCESS,
	LOAD_OPERATIONS_DOCUMENT_FAILURE,
	SAVE_OPERATIONS_DOCUMENT_SUCCESS,
} from 'js/actions/constants/operations/documents';
import { SAVE_OPERATIONS_SIMS_SUCCESS } from '../../actions/constants';

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
		case SAVE_OPERATIONS_SIMS_SUCCESS:
			return {};
		default:
			return state;
	}
};
