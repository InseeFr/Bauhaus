import * as A from 'js/actions/constants';
import { LOADED, LOADING, ERROR } from 'js/constants';
import { CL_SOURCE_CATEGORY, CL_FREQ } from 'js/actions/constants/codeList';

const defaultState = {
	results: {
		[CL_SOURCE_CATEGORY]: { codes: [] },
		[CL_FREQ]: { codes: [] },
	},
};
const operationsCodesList = function(state = defaultState, action) {
	switch (action.type) {
		case A.LOAD_OPERATIONS_CODES_LIST:
			return {
				...defaultState,
				status: LOADING,
			};
		case A.LOAD_OPERATIONS_CODES_LIST_SUCCESS:
			return {
				status: LOADED,
				results: {
					...state.results,
					[action.payload.notation]: action.payload,
				},
			};
		case A.LOAD_OPERATIONS_CODES_LIST_FAILURE:
			return {
				status: ERROR,
				err: action.payload.err,
			};
		default:
			return state;
	}
};

export default {
	operationsCodesList,
};
