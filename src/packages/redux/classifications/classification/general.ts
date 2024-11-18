import * as generalUtils from '../../../modules-classifications/utils/classification/general';
import { LOADED } from '@sdk/constants';
import {
	LOAD_CLASSIFICATION_GENERAL_SUCCESS,
	UPDATE_CLASSIFICATION_SUCCESS,
} from '../../actions/constants';
import { ReduxAction } from '../../model';

const reducers = (state: any = {}, action: ReduxAction) => {
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
					results: {
						...generalUtils.empty(),
						...results,
					},
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
