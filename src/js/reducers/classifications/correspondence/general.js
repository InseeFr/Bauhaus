import * as A from '../../../actions/constants';
import { LOADED } from '../../../constants';
import * as generalUtils from '../../../applications/classifications/utils/correspondence/general';

const reducers = (state = {}, action) => {
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
};

export default reducers;
export function getGeneral(state, id) {
	return state[id] && state[id].results;
}
