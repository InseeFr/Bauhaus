import * as A from '../../actions/constants';
import { LOADED, LOADING, ERROR } from '../../new-architecture/sdk/constants';
import { CL_SOURCE_CATEGORY, CL_FREQ } from '../../actions/constants/codeList';

const defaultState = {
	results: {
		[CL_SOURCE_CATEGORY]: { codes: [] },
		[CL_FREQ]: { codes: [] },
	},
};
const operationsCodesList = function (state = defaultState, action) {
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

const codesList = {
	operationsCodesList,
};

export default codesList;
