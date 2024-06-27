export const getPermission = state => {
	const {
		type: authType,
		user: { roles, stamp },
	} = state.app.auth;
	return { authType, roles, stamp };
};
