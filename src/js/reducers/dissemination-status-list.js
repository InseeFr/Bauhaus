import { LOAD_DISSEMINATION_STATUS_LIST_SUCCESS } from '../actions/dissemination-status';

export default function(state = {}, action) {
	if (action.type === LOAD_DISSEMINATION_STATUS_LIST_SUCCESS)
		return action.payload.results;
	return state;
}
