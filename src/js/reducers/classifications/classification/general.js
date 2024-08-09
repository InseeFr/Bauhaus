import * as A from '../../../actions/constants';
import { LOADED } from '../../../new-architecture/sdk/constants';
import * as generalUtils from '../../../applications/classifications/utils/classification/general';

const reducers = (state = {}, action) => {
	const { type, payload } = action;
	switch (type) {
		case A.UPDATE_CLASSIFICATION_SUCCESS: {
			const { id } = payload;
			return {
				...state,
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
};

export default reducers;

export function getGeneral(state, id) {
	return state[id] && state[id].results;
}
