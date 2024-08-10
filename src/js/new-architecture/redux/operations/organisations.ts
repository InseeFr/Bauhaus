import { LOADED, ERROR } from '../../sdk/constants';
import { ArrayUtils } from '../../../utils';
import {
	LOAD_OPERATIONS_ORGANISATIONS_FAILURE,
	LOAD_OPERATIONS_ORGANISATIONS_SUCCESS,
} from '../../../actions/constants';

const defaultState = {
	results: [],
};
const operationsOrganisations = function (state = defaultState, action: any) {
	switch (action.type) {
		case LOAD_OPERATIONS_ORGANISATIONS_SUCCESS:
			return {
				status: LOADED,
				results: ArrayUtils.sortArrayByLabel(action.payload),
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
