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
		case A.SAVE_OPERATIONS_SIMS_SUCCESS:
		case A.PUBLISH_OPERATIONS_SERIES_SUCCESS:
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
 * Reducer for fetching the current indicator displayed during the visualisation or the edition
 */
export const operationsSimsCurrent = function(state = {}, action) {
	switch (action.type) {
		case A.LOAD_OPERATIONS_SIMS_SUCCESS:
		case A.SAVE_OPERATIONS_SIMS:
			return action.payload;
		case A.LOAD_OPERATIONS_SERIE_SUCCESS:
		case A.SAVE_OPERATIONS_SIMS_SUCCESS:
		case A.PUBLISH_OPERATIONS_SIMS_SUCCESS:
			//When we save an item, we reset the current item stored in the store in order to send a new GET HTTP request
			return {};
		default:
			return state;
	}
};

export * from './loadStatus';
