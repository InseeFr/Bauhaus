import { LOAD_CONCEPTS_TO_VALIDATE_LIST_SUCCESS } from '../actions/concepts-list';

export default function(state = [], action) {
	if (action.type === LOAD_CONCEPTS_TO_VALIDATE_LIST_SUCCESS)
		return action.payload.results;
	return state;
}
