import { LOADED } from '../../../sdk/constants';
import { LOAD_CLASSIFICATION_LEVELS_SUCCESS } from '../../actions/constants';

const reducers = (state: any = {}, action: any) => {
	const { type, payload } = action;
	switch (type) {
		case LOAD_CLASSIFICATION_LEVELS_SUCCESS: {
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

export function getLevels(state: any, id: string) {
	return state[id] && state[id].results;
}
