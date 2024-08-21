import { ERROR, LOADED, LOADING } from '../sdk/constants';
import { ReduxModel } from './model';
import { UsersApi } from '../sdk/users-api';

// Constants
const LOAD_USER_STAMP = 'LOAD_USER_STAMP';
const LOAD_USER_STAMP_SUCCESS = 'LOAD_USER_STAMP_SUCCESS';
const LOAD_USER_STAMP_ERROR = 'LOAD_USER_STAMP_ERROR';

// Action creators
const loadUserStampPending = () => {
	return {
		type: LOAD_USER_STAMP,
	};
};
const loadUserStampSuccess = (stamp: string) => {
	return {
		type: LOAD_USER_STAMP_SUCCESS,
		payload: stamp,
	};
};
const loadUserStampError = (error: any) => {
	return {
		type: LOAD_USER_STAMP_ERROR,
		payload: error,
	};
};

// Reducer
export const reducer = (
	state: ReduxModel = {} as ReduxModel,
	{ type, payload }: any
) => {
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
export const loadUserStamp = () => (dispatch: any, getState: any) => {
	if (isLoading(getState())) {
		return;
	}
	dispatch(loadUserStampPending());
	return UsersApi.getStamp().then(
		(results: any) => {
			dispatch(loadUserStampSuccess(results));
		},
		(error: any) => loadUserStampError(error)
	);
};

// Selectors
export const getStamp = (state: ReduxModel) => state.users?.results?.stamp;

export const isLoading = (state: ReduxModel) => {
	return state.users?.status === LOADING;
};
