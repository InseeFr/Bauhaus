import * as A from 'js/actions/constants';
import { LOADED } from 'js/constants';
import * as generalUtils from 'js/utils/classifications/classification/general';

export default function(state = {}, action) {
	const { type, payload } = action;
	switch (type) {
		case A.UPDATE_CLASSIFICATION_SUCCESS: {
			const { id } = payload;
			return {
				...state,
				//TODO do optimistic updates
				[id]: {},
			};
		}
		case A.LOAD_CLASSIFICATION_GENERAL_SUCCESS: {
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
