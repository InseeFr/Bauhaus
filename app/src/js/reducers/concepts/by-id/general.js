import * as A from 'js/actions/constants';
import { LOADED } from 'js/constants';
import * as generalUtils from 'js/utils/concepts/general';

export default function(state = {}, action) {
	const { type, payload } = action;
	switch (type) {
		case A.DELETE_CONCEPT_SUCCESS: {
			const { id } = payload;
			return {
				...state,
				[id]: {},
			};
		}
		case A.UPDATE_CONCEPT_SUCCESS: {
			const { id } = payload;
			return {
				...state,
				[id]: {},
			};
		}
		case A.VALIDATE_CONCEPT_LIST_SUCCESS: {
			const { ids } = payload;
			const newState = {
				...state,
			};
			ids.forEach(id => (newState[id] = {}));
			return newState;
		}
		case A.LOAD_CONCEPT_GENERAL_SUCCESS: {
			const { id, results } = payload;
			return {
				...state,
				[id]: {
					status: LOADED,
					//ensure that all the fields are present (the server
					//does not return the fields not defined)
					results: Object.assign(generalUtils.empty(), results),
				},
			};
		}
		default:
			return state;
	}
}

export function getGeneral(state, id) {
	return state[id] && state[id].results;
}
