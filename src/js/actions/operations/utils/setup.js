import apiOrganisations from '../../../remote-api/organisations-api';
import {
	CL_SOURCE_CATEGORY,
	CL_FREQ,
} from '../../../actions/constants/codeList';
import * as A from '../../../actions/constants';
import { CodesList } from '../../../utils';

export const loadSetup = () => (dispatch) => {
	loadCodesList([CL_SOURCE_CATEGORY, CL_FREQ], dispatch);
	loadOrganisations(dispatch);
};
export function loadCodesList(notations, dispatch) {
	notations.forEach((notation) => {
		return Promise.all([
			CodesList.getCodesList(notation),
			CodesList.getCodesListCodes(notation, 1, 0),
		]).then(
			([codesList, codes]) =>
				dispatch({
					type: A.LOAD_OPERATIONS_CODES_LIST_SUCCESS,
					payload: {
						codes: codes.items ?? [],
						...codesList,
					},
				}),
			(err) =>
				dispatch({
					type: A.LOAD_OPERATIONS_CODES_LIST_FAILURE,
					payload: { err },
				})
		);
	});
}

export function loadOrganisations(dispatch) {
	return apiOrganisations.getOrganisations().then(
		(results) =>
			dispatch({
				type: A.LOAD_OPERATIONS_ORGANISATIONS_SUCCESS,
				payload: results,
			}),
		(err) =>
			dispatch({
				type: A.LOAD_OPERATIONS_ORGANISATIONS_FAILURE,
				payload: { err },
			})
	);
}
