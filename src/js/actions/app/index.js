import * as A from 'js/actions/constants';

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

export const checkAuth = body => ({
	type: A.CHECK_AUTH,
	payload: body,
});
