import { Dispatch } from 'redux';

import { ERROR, LOADED, LOADING } from '@sdk/constants';
import { GeographieApi } from '@sdk/geographie';

import { createAllDictionary } from '@utils/dictionnary';

import { ReduxModel } from './model';

// Constants
const LOAD_GEOGRAPHIES = 'LOAD_GEOGRAPHIES';
const LOAD_GEOGRAPHIES_SUCCESS = 'LOAD_GEOGRAPHIES_SUCCESS';
const LOAD_GEOGRAPHIES_ERROR = 'LOAD_GEOGRAPHIES_ERROR';

const { D1, D2 } = createAllDictionary({
	geography: {
		labelWithStartDate: {
			en: (label: string, startDate: string) => `${label} [since ${startDate}]`,
			fr: (label: string, startDate: string) =>
				`${label} [depuis le ${startDate}]`,
		},
		labelWithStartDateAndEndDate: {
			en: (label: string, startDate: string, endDate: string) =>
				`${label} [since ${startDate} until ${endDate}]`,
			fr: (label: string, startDate: string, endDate: string) =>
				`${label} [depuis le ${startDate} jusqu'au ${endDate}]`,
		},
	},
});
// Action creators
const loadGeographiesPending = () => {
	return {
		type: LOAD_GEOGRAPHIES,
	};
};
const loadGeographiesSuccess = (geographies: any) => {
	return {
		type: LOAD_GEOGRAPHIES_SUCCESS,
		payload: geographies,
	};
};
const loadGeographiesError = (error: string) => {
	return {
		type: LOAD_GEOGRAPHIES_ERROR,
		payload: error,
	};
};

// Reducer
export const reducer = (
	state: ReduxModel = {} as ReduxModel,
	{ type, payload }: any,
) => {
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
export const loadGeographies = () => (dispatch: Dispatch) => {
	dispatch(loadGeographiesPending());
	return GeographieApi.getAll().then(
		(results) => {
			dispatch(loadGeographiesSuccess(results));
		},
		(error) => loadGeographiesError(error),
	);
};

// Selectors
export const getAll = (state: ReduxModel) => state.geographies?.results || [];

const formatLabel = (
	label: string,
	geography: any,
	geographies: any,
	D: any,
) => {
	const numberOfGeographieWithTheSameName = geographies.filter(
		(g: any) => g.labelLg1 === geography.labelLg1,
	).length;

	if (numberOfGeographieWithTheSameName > 1) {
		if (geography.dateSuppression && geography.dateCreation) {
			return D.geography.labelWithStartDateAndEndDate(
				label,
				geography.dateCreation,
				geography.dateSuppression,
			);
		} else if (geography.dateCreation) {
			return D.geography.labelWithStartDate(label, geography.dateCreation);
		}
	}
	return label;
};

export const getAllOptions = (state: ReduxModel) => {
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
				D2,
			),
			value: geography.uri,
			typeTerritory: geography.typeTerritory,
			id: geography.id,
			geography,
		};
	});
};

export const isLoaded = (state: ReduxModel) =>
	state.geographies?.status !== LOADING && getAll(state)?.length > 0;
