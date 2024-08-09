import { ReduxModel } from './model';

export const getPermission = (state: ReduxModel) => {
	const {
		type: authType,
		user: { roles, stamp },
	} = state.app.auth;
	return { authType, roles, stamp };
};
