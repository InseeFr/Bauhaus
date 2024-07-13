import { Stores } from '../utils';

export const CHECK_AUTH = 'CHECK_AUTH';
export const SAVE_USER_PROPS = 'SAVE_USER_PROPS';

export const saveUserProps = (props) => {
	return {
		type: SAVE_USER_PROPS,
		payload: props,
	};
};

export const checkAuth = (body) => ({
	type: CHECK_AUTH,
	payload: body,
});

const UserReducer = (state = {}, action) => {
	const { type, payload } = action;
	switch (type) {
		case Stores.SecondLang.SAVE_SECOND_LANG: {
			return {
				...state,
				secondLang: payload,
			};
		}
		case SAVE_USER_PROPS: {
			return {
				...state,
				auth: { ...state.auth, user: payload },
			};
		}
		case CHECK_AUTH: {
			return {
				...state,
				auth: { ...state.auth, user: payload },
			};
		}
		default:
			return state;
	}
};

export default UserReducer;
