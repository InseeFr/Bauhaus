import * as generalUtils from '../../../../applications/classifications/utils/classification/general';
import {
	LOAD_CLASSIFICATION_GENERAL_SUCCESS,
	UPDATE_CLASSIFICATION_SUCCESS,
} from '../../../../actions/constants';
import { LOADED } from '../../../sdk/constants';

const reducers = (state: any = {}, action: any) => {
	const { type, payload } = action;
	switch (type) {
		case UPDATE_CLASSIFICATION_SUCCESS: {
			const { id } = payload;
			return {
				...state,
				[id]: {},
			};
		}
		case LOAD_CLASSIFICATION_GENERAL_SUCCESS: {
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
