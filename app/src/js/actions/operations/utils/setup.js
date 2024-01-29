import apiOrganisations from 'js/remote-api/organisations-api';
import loadStampList from 'js/actions/stamp';
import * as A from 'js/actions/constants';

export const loadSetup = () => (dispatch) => {
	loadOrganisations(dispatch);
	loadStampList()(dispatch);
};

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
