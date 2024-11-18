import { LOADING, NOT_LOADED, LOADED } from '@sdk/constants';

import {
	LOAD_OPERATIONS_SIMS,
	LOAD_OPERATIONS_SIMS_SUCCESS,
	SAVE_OPERATIONS_SIMS,
	SAVE_OPERATIONS_SIMS_SUCCESS,
} from '../actions/constants';
import { ReduxAction } from '../model';

/**
 * Track the loading of a SIMS. Used to avoid sending multiple request simultaneously
 */
export const operationsSimsCurrentStatus = function (
	state = NOT_LOADED,
	action: ReduxAction,
) {
	switch (action.type) {
		case LOAD_OPERATIONS_SIMS_SUCCESS:
			return LOADED;
		case SAVE_OPERATIONS_SIMS_SUCCESS:
			return NOT_LOADED;
		case LOAD_OPERATIONS_SIMS:
		case SAVE_OPERATIONS_SIMS:
			return LOADING;
		default:
			return state;
	}
};
