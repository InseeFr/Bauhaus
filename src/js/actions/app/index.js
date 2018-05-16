import * as A from 'js/actions/constants';
import api from 'js/remote-api/api';

export const saveSecondLang = secondLang => {
	return {
		type: A.SAVE_SECOND_LANG,
		payload: secondLang.target.checked,
	};
};

export const saveUserProps = props => {
	return {
		type: A.SAVE_USER_PROPS,
		payload: props,
	};
};

export const checkAuth = body => dispatch => {
	dispatch({
		type: A.CHECK_AUTH,
		payload: body,
	});
	return api.postAuth(body).then(
		result =>
			dispatch({
				type: A.CHECK_AUTH_SUCCESS,
				payload: result,
			}),
		err => dispatch({ type: A.CHECK_AUTH_FAILURE, payload: { err } })
	);
};
