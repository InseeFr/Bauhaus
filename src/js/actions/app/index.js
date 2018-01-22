import * as A from 'js/actions/constants';
import api from 'js/remote-api/api';

export const saveSecondLang = secondLang => {
	return {
		type: A.SAVE_SECOND_LANG,
		payload: secondLang.target.checked,
	};
};

export const checkAuth = mdp => dispatch => {
	dispatch({
		type: A.CHECK_AUTH,
		payload: false,
	});
	return api.postAuth(mdp).then(
		result =>
			dispatch({
				type: A.CHECK_AUTH_SUCCESS,
				payload: result,
			}),
		err => dispatch({ type: A.CHECK_AUTH_FAILURE, payload: { err } })
	);
};
