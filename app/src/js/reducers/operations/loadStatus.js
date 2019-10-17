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

function trackStatus(LOAD_SUCCESS, SAVE, SAVE_SUCCESS, LOAD) {
	return (state = NOT_LOADED, action) => {
		switch (action.type) {
			case LOAD_SUCCESS:
			case SAVE:
				return LOADED;
			case SAVE_SUCCESS:
				return NOT_LOADED;
			case LOAD:
				return LOADING;
			default:
				return state;
		}
	};
}

/**
 * Track the loading of an operation. Used to avoid sending multiple request simultaneously
 */
export const operationsOperationCurrentStatus = trackStatus(
	A.LOAD_OPERATIONS_OPERATION_SUCCESS,
	A.SAVE_OPERATIONS_OPERATION,
	A.SAVE_OPERATIONS_OPERATION_SUCCESS,
	A.LOAD_OPERATIONS_OPERATION
);

/**
 * Track the loading of an indicator. Used to avoid sending multiple request simultaneously
 */
export const operationsIndicatorCurrentStatus = trackStatus(
	A.LOAD_OPERATIONS_INDICATOR_SUCCESS,
	A.SAVE_OPERATIONS_INDICATOR,
	A.SAVE_OPERATIONS_INDICATOR_SUCCESS,
	A.LOAD_OPERATIONS_INDICATOR
);

/**
 * Track the loading of an series. Used to avoid sending multiple request simultaneously
 */
export const operationsSeriesCurrentStatus = trackStatus(
	A.LOAD_OPERATIONS_SERIE_SUCCESS,
	A.SAVE_OPERATIONS_SERIE,
	A.SAVE_OPERATIONS_SERIE_SUCCESS,
	A.LOAD_OPERATIONS_SERIE
);

export const operationsFamilyCurrentStatus = trackStatus(
	A.LOAD_OPERATIONS_FAMILY_SUCCESS,
	A.SAVE_OPERATIONS_FAMILY,
	A.SAVE_OPERATIONS_FAMILY_SUCCESS,
	A.LOAD_OPERATIONS_FAMILY
);
