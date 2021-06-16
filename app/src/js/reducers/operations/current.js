import * as A from 'js/actions/constants';

/**
 * Reducer for fetching the current series displayed during the visualisation or the edition
 */
export const operationsSeriesCurrent = function(state = {}, action) {
	switch (action.type) {
		case A.LOAD_OPERATIONS_SERIE_SUCCESS:
		case A.SAVE_OPERATIONS_SERIE:
			return action.payload;
		case A.SAVE_OPERATIONS_SERIE_SUCCESS:
		case A.SAVE_OPERATIONS_OPERATION_SUCCESS:
		case A.SAVE_OPERATIONS_SIMS_SUCCESS:
		case A.PUBLISH_OPERATIONS_SERIES_SUCCESS:
		case A.SAVE_OPERATIONS_INDICATOR_SUCCESS:
			//When we save an item, we reset the current item stored in the store in order to send a new GET HTTP request
			return {};
		case A.DELETE_SIMS_SUCCESS:
			return {
				...state,
				idSims: null
			}
		default:
			return state;
	}
};

/**
 * Reducer for fetching the current family displayed during the visualisation or the edition
 */
export const operationsFamiliesCurrent = function(state = {}, action) {
	switch (action.type) {
		case A.LOAD_OPERATIONS_FAMILY_SUCCESS:
			return action.payload;
		case A.SAVE_OPERATIONS_SERIE_SUCCESS:
		case A.DELETE_SIMS_SUCCESS:
		case A.SAVE_OPERATIONS_FAMILY:
		case A.PUBLISH_OPERATIONS_FAMILY_SUCCESS:
			return {};
		default:
			return state;
	}
};

/**
 * Reducer for fetching the current operation displayed during the visualisation or the edition
 */
export const operationsOperationsCurrent = function(state = {}, action) {
	switch (action.type) {
		case A.LOAD_OPERATIONS_OPERATION_SUCCESS:
		case A.SAVE_OPERATIONS_OPERATION:
			return action.payload;
		case A.SAVE_OPERATIONS_OPERATION_SUCCESS:
		case A.SAVE_OPERATIONS_SIMS_SUCCESS:
		case A.PUBLISH_OPERATIONS_OPERATION_SUCCESS:
			return {};
		default:
			return state;
	}
};

/**
 * Reducer for fetching the current indicator displayed during the visualisation or the edition
 */
export const operationsIndicatorsCurrent = function(state = {}, action) {
	switch (action.type) {
		case A.LOAD_OPERATIONS_INDICATOR_SUCCESS:
		case A.SAVE_OPERATIONS_INDICATOR:
			return action.payload;
		case A.SAVE_OPERATIONS_INDICATOR_SUCCESS:
		case A.SAVE_OPERATIONS_SIMS_SUCCESS:
		case A.PUBLISH_OPERATIONS_INDICATOR_SUCCESS:
			//When we save an item, we reset the current item stored in the store in order to send a new GET HTTP request
			return {};
		default:
			return state;
	}
};

/**
 * Reducer for fetching the current indicator displayed during the visualisation or the edition
 */
export const operationsSimsCurrent = function(state = {}, action) {
	switch (action.type) {
		case A.LOAD_OPERATIONS_SIMS_SUCCESS:
		case A.SAVE_OPERATIONS_SIMS:
			return action.payload;
		case A.LOAD_OPERATIONS_SERIE_SUCCESS:
		case A.LOAD_OPERATIONS_INDICATOR_SUCCESS:
		case A.LOAD_OPERATIONS_OPERATION_SUCCESS:
		case A.SAVE_OPERATIONS_SIMS_SUCCESS:
		case A.PUBLISH_OPERATIONS_SIMS_SUCCESS:
			//When we save an item, we reset the current item stored in the store in order to send a new GET HTTP request
			return {};
		default:
			return state;
	}
};

export * from './loadStatus';
