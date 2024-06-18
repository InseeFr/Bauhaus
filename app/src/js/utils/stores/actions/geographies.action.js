import * as API from '../../apis/build-api';
import { LOADING, LOADED, ERROR } from '../constants';
import { D1, D2 } from '../../i18n/build-dictionary';

// Constants
const LOAD_GEOGRAPHIES = 'LOAD_GEOGRAPHIES';
const LOAD_GEOGRAPHIES_SUCCESS = 'LOAD_GEOGRAPHIES_SUCCESS';
const LOAD_GEOGRAPHIES_ERROR = 'LOAD_GEOGRAPHIES_ERROR';

// API
const apiConfig = {
	getAll: () => ['territories'],
	postTerritory: (territory) => [
		`territory`,
		{
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(territory),
		},
		(res) => res.text(),
	],
	putTerritory: (id, territory) => [
		`territory/` + id,
		{
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(territory),
		},
		(res) => res.text(),
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

const formatLabel = (label, geography, geographies, D) => {
	const numberOfGeographieWithTheSameName = geographies.filter(
		(g) => g.labelLg1 === geography.labelLg1
	).length;

	if (numberOfGeographieWithTheSameName > 1) {
		if (geography.dateSuppression && geography.dateCreation) {
			return D.geography.labelWithStartDateAndEndDate(
				label,
				geography.dateCreation,
				geography.dateSuppression
			);
		} else if (geography.dateCreation) {
			return D.geography.labelWithStartDate(label, geography.dateCreation);
		}
	}
	return label;
};

export const getAllOptions = (state) => {
	const geographies = getAll(state);
	const geographiesSorted = geographies
		?.filter(({ labelLg1 }) => labelLg1)
		.sort((g1, g2) => {
			return g1.labelLg1.toLowerCase().localeCompare(g2.labelLg1.toLowerCase());
		});

	if (geographiesSorted.length > 2) {
		geographiesSorted[1].labelLg1 = geographiesSorted[0].labelLg1;
		geographiesSorted[1].dateCreation = '1970-04-13';
		geographiesSorted[1].dateSuppression = '2020-04-13';
	}

	return geographiesSorted.map((geography) => {
		return {
			label: formatLabel(geography.labelLg1, geography, geographiesSorted, D1),
			labelLg2: formatLabel(
				geography.labelLg2,
				geography,
				geographiesSorted,
				D2
			),
			value: geography.uri,
			typeTerritory: geography.typeTerritory,
			id: geography.id,
			geography,
		};
	});
};

export const isLoaded = (state) =>
	state.geographies.status !== LOADING && getAll(state)?.length > 0;
