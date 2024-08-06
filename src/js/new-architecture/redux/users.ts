import { SAVE_SECOND_LANG } from '../../utils/stores/second-lang';

export const CHECK_AUTH = 'CHECK_AUTH';
export const SAVE_USER_PROPS = 'SAVE_USER_PROPS';

export const saveUserProps = (props: unknown) => {
	return {
		type: SAVE_USER_PROPS,
		payload: props,
	};
};

export const checkAuth = (body: unknown) => ({
	type: CHECK_AUTH,
	payload: body,
});

const UserReducer = (state: any = {}, action: unknown) => {
	const { type, payload } = action as any;
	switch (type) {
		case SAVE_SECOND_LANG: {
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
