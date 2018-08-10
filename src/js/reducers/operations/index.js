import * as A from 'js/actions/constants';
import { LOADED, LOADING, ERROR } from 'js/constants';

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
				return {
					status: state.status,
					results: [...state.results, action.payload],
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
]);

const operationsSeriesCurrent = function(state = {}, action) {
	switch (action.type) {
		case A.LOAD_OPERATIONS_SERIE_SUCCESS:
		case A.SAVE_OPERATIONS_SERIE:
			return action.payload;

		default:
			return state;
	}
};
const operationsFamiliesCurrent = function(state = {}, action) {
	switch (action.type) {
		case A.LOAD_OPERATIONS_FAMILY_SUCCESS:
		case A.SAVE_OPERATIONS_FAMILY:
			return action.payload;

		default:
			return state;
	}
};
const operationsOperationsCurrent = function(state = {}, action) {
	switch (action.type) {
		case A.LOAD_OPERATIONS_OPERATION_SUCCESS:
		case A.SAVE_OPERATIONS_OPERATION:
			return action.payload;

		default:
			return state;
	}
};

const operationsIndicatorsCurrent = function(state = {}, action) {
	switch (action.type) {
		case A.LOAD_OPERATIONS_INDICATOR_SUCCESS:
		case A.SAVE_OPERATIONS_INDICATOR:
			return action.payload;

		default:
			return state;
	}
};

const operationsAsyncTask = function(state = false, action) {
	switch (action.type) {
		case A.SAVE_OPERATIONS_INDICATOR:
			return true;
		case A.SAVE_OPERATIONS_INDICATOR_SUCCESS:
		case A.SAVE_OPERATIONS_INDICATOR_FAILURE:
			return false;

		default:
			return state;
	}
};
const operationsOperationsList = makeReducers([
	A.LOAD_OPERATIONS_OPERATIONS_LIST,
	A.LOAD_OPERATIONS_OPERATIONS_LIST_SUCCESS,
	A.LOAD_OPERATIONS_OPERATIONS_LIST_FAILURE,
]);

const operationsFamiliesList = makeReducers([
	A.LOAD_OPERATIONS_FAMILIES_LIST,
	A.LOAD_OPERATIONS_FAMILIES_LIST_SUCCESS,
	A.LOAD_OPERATIONS_FAMILIES_LIST_FAILURE,
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
	operationsFamiliesList,
	operationsSeriesCurrent,
	operationsFamiliesCurrent,
	operationsOperationsCurrent,
	operationsIndicatorsCurrent,
	operationsIndicatorsList,
	operationsAsyncTask,
};
