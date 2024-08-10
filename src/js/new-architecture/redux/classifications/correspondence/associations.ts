import { LOAD_CLASSIFICATION_CORRESPONDENCE_ASSOCIATIONS_SUCCESS } from '../../../../actions/constants';
import { LOADED } from '../../../sdk/constants';

const reducers = (state: any = {}, action: any) => {
	const { type, payload } = action;
	switch (type) {
		case LOAD_CLASSIFICATION_CORRESPONDENCE_ASSOCIATIONS_SUCCESS: {
			const { id, results } = payload;
			return {
				...state,
				[id]: {
					status: LOADED,
					results,
				},
			};
		}
		default:
			return state;
	}
};

export default reducers;

export function getAssociations(state: any, id: string) {
	return state[id] && state[id].results;
}
