import api from 'js/remote-api/codelist-api';
import apiOrganisations from 'js/remote-api/organisations-api';
import { CL_SOURCE_CATEGORY, CL_FREQ } from 'js/actions/constants/codeList';
import loadIndicators from 'js/actions/operations/indicators/list';
import loadSeries from 'js/actions/operations/series/list';

import * as A from 'js/actions/constants';

export const loadSetup = () => dispatch => {
	loadCodesList([CL_SOURCE_CATEGORY, CL_FREQ], dispatch);
	loadOrganisations(dispatch);
	loadIndicators()(dispatch);
	loadSeries()(dispatch);
};
export function loadCodesList(notations, dispatch) {
	notations.forEach(notation => {
		return api.getCodesList(notation).then(
			results =>
				dispatch({
					type: A.LOAD_OPERATIONS_CODES_LIST_SUCCESS,
					payload: results,
				}),
			err =>
				dispatch({
					type: A.LOAD_OPERATIONS_CODES_LIST_FAILURE,
					payload: { err },
				})
		);
	});
}

export function loadOrganisations(dispatch) {
	return apiOrganisations.getOrganisations().then(
		results =>
			dispatch({
				type: A.LOAD_OPERATIONS_ORGANISATIONS_SUCCESS,
				payload: results,
			}),
		err =>
			dispatch({
				type: A.LOAD_OPERATIONS_ORGANISATIONS_FAILURE,
				payload: { err },
			})
	);
}
