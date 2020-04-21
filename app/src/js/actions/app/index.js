import * as A from 'js/actions/constants';

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
