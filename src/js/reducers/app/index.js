import * as A from 'js/actions/constants';

const initialState = { secondLang: false };

export default function(state = initialState, action) {
	const { type, payload } = action;
	switch (type) {
		case A.SAVE_SECOND_LANG: {
			return {
				...state,
				secondLang: payload,
			};
		}
		default:
			return state;
	}
}
