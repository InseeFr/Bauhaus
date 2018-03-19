import * as A from 'js/actions/constants';

export default function(state = {}, action) {
	const { type, payload } = action;
	if (/FAILURE$/.test(type)) {
		return {
			...state,
			error: true,
		};
	}
	switch (type) {
		case A.SAVE_SECOND_LANG: {
			return {
				...state,
				secondLang: payload,
			};
		}
		case A.CHECK_AUTH_SUCCESS: {
			return {
				...state,
				auth: { ...state.auth, user: payload },
			};
		}
		default:
			return state;
	}
}
