import {
	LOAD_CONCEPTS_LIST,
	LOAD_CONCEPTS_LIST_SUCCESS,
	LOAD_CONCEPTS_LIST_FAILURE,
} from '../actions/concepts-list';

import { LOADING, LOADED, FAILURE } from 'js/constants';

export default function(state = null, action) {
	switch (action.type) {
		case LOAD_CONCEPTS_LIST:
			return { ...state, status: LOADING };
		case LOAD_CONCEPTS_LIST_SUCCESS:
			return { status: LOADED, results: action.payload.results };
		case LOAD_CONCEPTS_LIST_FAILURE:
			return { status: FAILURE, err: action.payload.err };
		default:
			return state;
	}
}
