import * as A from 'js/actions/constants';
import { LOADED, ERROR } from 'js/constants';
import { sortArray } from 'js/utils/array-utils';

const sortByLabel = sortArray('label');

const defaultState = {
	results: [],
};
const operationsOrganisations = function(state = defaultState, action) {
	switch (action.type) {
		case A.LOAD_OPERATIONS_ORGANISATIONS_SUCCESS:
			return {
				status: LOADED,
				results: sortByLabel(action.payload),
			};
		case A.LOAD_OPERATIONS_ORGANISATIONS_FAILURE:
			return {
				status: ERROR,
				err: action.payload.err,
			};
		default:
			return state;
	}
};

export default {
	operationsOrganisations,
};
