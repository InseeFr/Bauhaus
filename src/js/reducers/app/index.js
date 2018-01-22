import * as A from 'js/actions/constants';

const initialState = { auth: false, secondLang: false };

export default function(state = initialState, action) {
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
				auth: payload,
			};
		}
		default:
			return state;
	}
}
