import * as A from 'js/actions/constants';
import { LOADED } from 'js/constants';
import * as generalUtils from 'js/applications/classifications/utils/correspondence/general';

export default function(state = {}, action) {
	const { type, payload } = action;
	switch (type) {
		case A.LOAD_CLASSIFICATION_CORRESPONDENCE_GENERAL_SUCCESS: {
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
