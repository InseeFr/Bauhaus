import * as A from 'js/actions/constants';
import { LOADED, LOADING, ERROR } from 'js/constants';
import * as currentReducers from 'js/reducers/operations/current';
import * as documentsReducers from 'js/reducers/operations/documents';
import { ArrayUtils } from 'bauhaus-utilities';

/**
 *
 * @param {Array<String>} param List of Redux event
 */
function makeReducers([
	GET_ITEMS,
	GET_ITEMS_SUCCESS,
	GET_ITEMS_FAILURE,
	SAVE_ITEM_SUCCESS,
]) {
	return function(state = {}, action) {
		switch (action.type) {
			case GET_ITEMS:
				return {
					status: LOADING,
				};
			case GET_ITEMS_SUCCESS:
				return {
					status: LOADED,
					results: action.payload.results,
				};
			case GET_ITEMS_FAILURE:
				return {
					status: ERROR,
					err: action.payload.err,
				};
			case SAVE_ITEM_SUCCESS:
				if (!state.results) return state;

				/**
				 * When we add / update a new object, we must first remove this updated item from
				 * the previous list.
				 *
				 * Finally, we should sort by label again
				 */
				const tail = state.results.filter(obj => obj.id !== action.payload.id);
				return {
					status: state.status,
					results: ArrayUtils.sortArrayByLabel([
						...tail,
						{
							id: action.payload.id,
							label: action.payload.prefLabelLg1,
							altLabel: action.payload.altLabelLg1 || action.payload.altLabel,
						},
					]),
				};
			default:
				return state;
		}
	};
}

/**
 * @typedef {Object} ActionType
 * @property {string} type
 * @property {Object} payload
 */

/**
 * Reducer to store the state of any asynchronous operations.
 * The boolean state is used to display / hide a spinner
 *
 * @param {Boolean} state
 * @param {ActionType} action
 * @returns {Boolean}
 */
const operationsAsyncTask = function(state = false, action) {
	switch (action.type) {
		case A.SAVE_OPERATIONS_INDICATOR:
		case A.SAVE_OPERATIONS_SERIE:
		case A.SAVE_OPERATIONS_OPERATION:
		case A.SAVE_OPERATIONS_DOCUMENT:
			return true;
		case A.SAVE_OPERATIONS_INDICATOR_SUCCESS:
		case A.SAVE_OPERATIONS_INDICATOR_FAILURE:
		case A.SAVE_OPERATIONS_SERIE_SUCCESS:
		case A.SAVE_OPERATIONS_SERIE_FAILURE:
		case A.SAVE_OPERATIONS_OPERATION_SUCCESS:
		case A.SAVE_OPERATIONS_OPERATION_FAILURE:
		case A.SAVE_OPERATIONS_DOCUMENT_SUCCESS:
		case A.SAVE_OPERATIONS_DOCUMENT_FAILURE:
			return false;

		default:
			return state;
	}
};

const operationsSeriesList = makeReducers([
	A.LOAD_OPERATIONS_SERIES_LIST,
	A.LOAD_OPERATIONS_SERIES_LIST_SUCCESS,
	A.LOAD_OPERATIONS_SERIES_LIST_FAILURE,
	A.SAVE_OPERATIONS_SERIE_SUCCESS,
]);

const operationsOperationsList = makeReducers([
	A.LOAD_OPERATIONS_OPERATIONS_LIST,
	A.LOAD_OPERATIONS_OPERATIONS_LIST_SUCCESS,
	A.LOAD_OPERATIONS_OPERATIONS_LIST_FAILURE,
	A.SAVE_OPERATIONS_OPERATION_SUCCESS,
]);

const operationsMetadataStructureList = makeReducers([
	A.LOAD_OPERATIONS_METADATASTRUCTURE_LIST,
	A.LOAD_OPERATIONS_METADATASTRUCTURE_LIST_SUCCESS,
	A.LOAD_OPERATIONS_METADATASTRUCTURE_LIST_FAILURE,
]);
const operationsIndicatorsList = makeReducers([
	A.LOAD_OPERATIONS_INDICATORS_LIST,
	A.LOAD_OPERATIONS_INDICATORS_LIST_SUCCESS,
	A.LOAD_OPERATIONS_INDICATORS_LIST_FAILURE,
	A.SAVE_OPERATIONS_INDICATOR_SUCCESS,
]);

export default {
	operationsSeriesList,
	operationsOperationsList,
	operationsMetadataStructureList,
	operationsIndicatorsList,
	operationsAsyncTask,
	...currentReducers,
	...documentsReducers,
};
