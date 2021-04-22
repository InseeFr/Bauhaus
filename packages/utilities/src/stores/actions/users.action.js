import * as API from '../../apis/build-api';
import { LOADING, LOADED, ERROR } from '../constants';

// Constants
const LOAD_USER_STAMP = 'LOAD_USER_STAMP';
const LOAD_USER_STAMP_SUCCESS = 'LOAD_USER_STAMP_SUCCESS';
const LOAD_USER_STAMP_ERROR = 'LOAD_USER_STAMP_ERROR';

// API
const apiConfig = {
	getStamp: () => ['stamp'],
};
const api = API.buildApi('users', apiConfig);


// Action creators
const loadUserStampPending = () => {
	return {
		type: LOAD_USER_STAMP,
	};
};
const loadUserStampSuccess = (stamp) => {
	return {
		type: LOAD_USER_STAMP_SUCCESS,
		payload: stamp,
	};
};
const loadUserStampError = (error) => {
	return {
		type: LOAD_USER_STAMP_ERROR,
		payload: error,
	};
};

// Reducer
export const reducer = (state = {}, { type, payload }) => {
	switch (type) {
		case LOAD_USER_STAMP:
			return {
				status: LOADING,
			};
		case LOAD_USER_STAMP_SUCCESS:
			return {
				status: LOADED,
				results: payload,
			};
		case LOAD_USER_STAMP_ERROR:
			return {
				status: ERROR,
				error: payload.error,
			};

		default:
			return state;
	}
};

// loader
export const loadUserStamp = () => (dispatch) => {
	dispatch(loadUserStampPending());
	return api.getStamp().then(
		(results) => {
			dispatch(loadUserStampSuccess(results));
		},
		(error) => loadUserStampError(error)
	);
};

// Selectors
export const getStamp = (state) => state.users?.results?.stamp;
export const isLoaded = (state) => {
	return state.users === {}
}
export const isLoading = (state) => {
	return state.users.status === LOADING;
}
