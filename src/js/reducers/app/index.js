import * as A from 'js/actions/constants';

export default function(state = {}, action) {
	const { type, payload } = action;
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
				auth: { ...state.auth, payload },
			};
		}
		case A.LOAD_PROPERTIES_SUCCESS: {
			return {
				...state,
				properties: payload,
			};
		}
		default:
			return state;
	}
}
