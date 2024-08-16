import { LOADED, ERROR } from '../../sdk/constants';
import {
	LOAD_OPERATIONS_ORGANISATIONS_FAILURE,
	LOAD_OPERATIONS_ORGANISATIONS_SUCCESS,
} from '../actions/constants';
import { sortArrayByLabel } from '../../utils/array-utils';

const defaultState = {
	results: [],
};
const operationsOrganisations = function (state = defaultState, action: any) {
	switch (action.type) {
		case LOAD_OPERATIONS_ORGANISATIONS_SUCCESS:
			return {
				status: LOADED,
				results: sortArrayByLabel(action.payload),
			};
		case LOAD_OPERATIONS_ORGANISATIONS_FAILURE:
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
