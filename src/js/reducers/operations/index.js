import * as A from 'js/actions/constants';
import { LOADED, LOADING, ERROR, PARTIAL_LOADED } from 'js/constants';

function makeReducers([
	GET_ITEMS,
	GET_ITEMS_SUCCESS,
	GET_ITEMS_FAILURE,
	GET_ITEM_SUCCESS,
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
			case GET_ITEM_SUCCESS:
				return {
					status: PARTIAL_LOADED,
					results: [action.payload],
				};
			case SAVE_ITEM_SUCCESS:
				return {
					status: state.status,
					results: state.results.map(f => {
						if (f.id === action.payload.id) return action.payload;
						return f;
					}),
				};
			default:
				return state;
		}
	};
}

const operationsSeriesList = makeReducers([
	A.LOAD_OPERATIONS_SERIES_LIST,
	A.LOAD_OPERATIONS_SERIES_LIST_SUCCESS,
	A.LOAD_OPERATIONS_SERIES_LIST_FAILURE,
	A.LOAD_OPERATIONS_SERIE_SUCCESS,
	A.SAVE_OPERATIONS_SERIE_SUCCESS,
]);

const operationsOperationsList = makeReducers([
	A.LOAD_OPERATIONS_OPERATIONS_LIST,
	A.LOAD_OPERATIONS_OPERATIONS_LIST_SUCCESS,
	A.LOAD_OPERATIONS_OPERATIONS_LIST_FAILURE,
	A.LOAD_OPERATIONS_OPERATION_SUCCESS,
	A.SAVE_OPERATIONS_OPERATION_SUCCESS,
]);

const operationsFamiliesList = makeReducers([
	A.LOAD_OPERATIONS_FAMILIES_LIST,
	A.LOAD_OPERATIONS_FAMILIES_LIST_SUCCESS,
	A.LOAD_OPERATIONS_FAMILIES_LIST_FAILURE,
	A.LOAD_OPERATIONS_FAMILY_SUCCESS,
	A.SAVE_OPERATIONS_FAMILY_SUCCESS,
]);

export default {
	operationsSeriesList,
	operationsOperationsList,
	operationsFamiliesList,
};
