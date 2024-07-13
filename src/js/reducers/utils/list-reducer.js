import { LOADED, LOADING, ERROR } from '../../constants';

export default function listReducer([load, success, failure]) {
	return function (state = {}, action) {
		switch (action.type) {
			case load:
				return {
					status: LOADING,
				};
			case success:
				return {
					status: LOADED,
					results: action.payload.results,
				};
			case failure:
				return {
					status: ERROR,
					err: action.payload.err,
				};
			default:
				return state;
		}
	};
}

export const getItems = (state) => state.results;
