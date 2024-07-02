import jwt_decode from 'jwt-decode';

export const SESSION_ITEM = '__SESSION_ITEM__';

export const getToken = () =>
	window.localStorage ? window.localStorage.getItem(SESSION_ITEM) : null;

export const setToken = token =>
	window.localStorage.setItem(SESSION_ITEM, token);

export const getAuthPropsFromToken = tokenParsed => {
	const roles = tokenParsed.realm_access.roles;
	const stamp = tokenParsed.timbre;
	return { roles, stamp };
};

export const isTokenValid = token =>
	new Date().getTime() / 1000 < jwt_decode(token).exp;
