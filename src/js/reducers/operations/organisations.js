import * as A from '../../actions/constants';
import { LOADED, ERROR } from '../../constants';
import { ArrayUtils } from '../../utils';

const defaultState = {
	results: [],
};
const operationsOrganisations = function (state = defaultState, action) {
	switch (action.type) {
		case A.LOAD_OPERATIONS_ORGANISATIONS_SUCCESS:
			return {
				status: LOADED,
				results: ArrayUtils.sortArrayByLabel(action.payload),
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

const organisations = {
	operationsOrganisations,
};

export default organisations;
