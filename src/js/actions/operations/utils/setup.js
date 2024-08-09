import { OrganisationsApi } from '../../../new-architecture/sdk';
import { CL_SOURCE_CATEGORY, CL_FREQ } from '../../constants/codeList';
import * as A from '../../../actions/constants';
import { CodeListApi } from '../../../new-architecture/sdk';

export const loadSetup = () => (dispatch) => {
	loadCodesList([CL_SOURCE_CATEGORY, CL_FREQ], dispatch);
	loadOrganisations(dispatch);
};
export function loadCodesList(notations, dispatch) {
	notations.forEach((notation) => {
		return Promise.all([
			CodeListApi.getCodesList(notation),
			CodeListApi.getCodesListCodes(notation, 1, 0),
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
	return OrganisationsApi.getOrganisations().then(
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
