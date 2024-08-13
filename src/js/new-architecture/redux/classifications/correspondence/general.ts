import * as generalUtils from '../../../../applications/classifications/utils/correspondence/general';
import { LOADED } from '../../../sdk/constants';
import { LOAD_CLASSIFICATION_CORRESPONDENCE_GENERAL_SUCCESS } from '../../actions/constants';

const reducers = (state: any = {}, action: any) => {
	const { type, payload } = action;
	switch (type) {
		case LOAD_CLASSIFICATION_CORRESPONDENCE_GENERAL_SUCCESS: {
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
export function getGeneral(state: any, id: string) {
	return state[id] && state[id].results;
}
