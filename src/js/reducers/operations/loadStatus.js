import * as A from 'js/actions/constants';
import { LOADING, NOT_LOADED, LOADED } from 'js/constants';

/**
 * Track the loading of a SIMS. Used to avoid sending multiple request simultaneously
 */
export const operationsSimsCurrentStatus = function(
	state = NOT_LOADED,
	action
) {
	switch (action.type) {
		case A.LOAD_OPERATIONS_SIMS_SUCCESS:
			return LOADED;
		case A.SAVE_OPERATIONS_SIMS_SUCCESS:
			return NOT_LOADED;
		case A.LOAD_OPERATIONS_SIMS:
		case A.SAVE_OPERATIONS_SIMS:
			return LOADING;
		default:
			return state;
	}
};

/**
 * Track the loading of an operation. Used to avoid sending multiple request simultaneously
 */
export const operationsOperationCurrentStatus = function(
	state = NOT_LOADED,
	action
) {
	switch (action.type) {
		case A.LOAD_OPERATIONS_OPERATION_SUCCESS:
		case A.SAVE_OPERATIONS_OPERATION:
			return LOADED;
		case A.SAVE_OPERATIONS_OPERATION_SUCCESS:
			return NOT_LOADED;
		case A.LOAD_OPERATIONS_OPERATION:
			return LOADING;
		default:
			return state;
	}
};
