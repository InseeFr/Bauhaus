import * as A from '../../actions/constants';
import {
	LOADING,
	NOT_LOADED,
	LOADED,
} from '../../new-architecture/sdk/constants';

/**
 * Track the loading of a SIMS. Used to avoid sending multiple request simultaneously
 */
export const operationsSimsCurrentStatus = function (
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
