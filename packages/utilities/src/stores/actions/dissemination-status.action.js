import { buildApi } from '../../apis/build-api';
import { ERROR, LOADED, LOADING } from '../constants';

export const LOAD_DISSEMINATION_STATUS_LIST = 'LOAD_DISSEMINATION_STATUS_LIST';
export const LOAD_DISSEMINATION_STATUS_LIST_SUCCESS =
	'LOAD_DISSEMINATION_STATUS_LIST_SUCCESS';
export const LOAD_DISSEMINATION_STATUS_LIST_FAILURE =
	'LOAD_DISSEMINATION_STATUS_LIST_FAILURE';

export const apiConfig = {
	getDisseminationStatus: () => [''],
};

const api = buildApi('disseminationStatus', apiConfig);

export const reducer = (state = {}, { type, payload }) => {
	switch (type) {
		case LOAD_DISSEMINATION_STATUS_LIST:
			return {
				status: LOADING,
			};
		case LOAD_DISSEMINATION_STATUS_LIST_SUCCESS:
			return {
				status: LOADED,
				results: payload.results,
			};
		case LOAD_DISSEMINATION_STATUS_LIST_FAILURE:
			return {
				status: ERROR,
				error: payload.err,
			};

		default:
			return state;
	}
};


export const loadDisseminationStatusList = () => dispatch => {
	dispatch({
		type: LOAD_DISSEMINATION_STATUS_LIST,
		payload: {},
	});
	return api.getDisseminationStatus().then(
		results => {
			dispatch({
				type: LOAD_DISSEMINATION_STATUS_LIST_SUCCESS,
				payload: { results },
			});
		},
		err =>
			dispatch({
				type: LOAD_DISSEMINATION_STATUS_LIST_FAILURE,
				payload: { err },
			})
	);
};

export const getDisseminationStatusList = (state) => state.disseminationStatus.results || [];
export const getDisseminationStatusListOptions = (state) => getDisseminationStatusList(state).map(({ url, label }) => ({ value: url, label: label}))

