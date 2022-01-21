import * as API from '../../apis/build-api';
import { createSelector } from 'reselect';
import { LOADING, LOADED, ERROR } from '../constants';

// Constants
const LOAD_GEOGRAPHIES = 'LOAD_GEOGRAPHIES';
const LOAD_GEOGRAPHIES_SUCCESS = 'LOAD_GEOGRAPHIES_SUCCESS';
const LOAD_GEOGRAPHIES_ERROR = 'LOAD_GEOGRAPHIES_ERROR';

// API
const apiConfig = {
	getAll: () => ['territories'],
	postTerritory: territory => [
		`territory`,
		{
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(territory),
		},
		res => res.text(),
	],
	putTerritory: (id, territory) => [
		`territory/` + id,
		{
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(territory),
		},
		res => res.text(),
	],
};
export const api = API.buildApi('geo', apiConfig);

// Action creators
const loadGeographiesPending = () => {
	return {
		type: LOAD_GEOGRAPHIES,
	};
};
const loadGeographiesSuccess = (geographies) => {
	return {
		type: LOAD_GEOGRAPHIES_SUCCESS,
		payload: geographies,
	};
};
const loadGeographiesError = (error) => {
	return {
		type: LOAD_GEOGRAPHIES_ERROR,
		payload: error,
	};
};

// Reducer
export const reducer = (state = {}, { type, payload }) => {
	switch (type) {
		case LOAD_GEOGRAPHIES:
			return {
				status: LOADING,
			};
		case LOAD_GEOGRAPHIES_SUCCESS:
			return {
				status: LOADED,
				results: payload,
			};
		case LOAD_GEOGRAPHIES_ERROR:
			return {
				status: ERROR,
				error: payload.error,
			};

		default:
			return state;
	}
};

// loader
export const loadGeographies = () => (dispatch) => {
	dispatch(loadGeographiesPending());
	return api.getAll().then(
		(results) => {
			dispatch(loadGeographiesSuccess(results));
		},
		(error) => loadGeographiesError(error)
	);
};

// Selectors
export const getAll = (state) => state.geographies.results || [];
export const getAllOptions = createSelector(getAll, (geographies) => {
	return geographies
		?.filter(({ dateSuppression, labelLg1 }) => !dateSuppression && labelLg1)
		.sort((g1, g2) => {
			return g1.labelLg1.toLowerCase().localeCompare(g2.labelLg1.toLowerCase());
		})
		.map((geography) => ({
			label: geography.labelLg1,
			labelLg2: geography.labelLg2,
			value: geography.uri,
			typeTerritory: geography.typeTerritory,
			id: geography.id,
			geography
		}));
});

export const isLoaded = (state) =>
	state.geographies.status !== LOADING && getAll(state)?.length > 0;
