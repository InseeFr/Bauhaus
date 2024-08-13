import jwt_decode from 'jwt-decode';

type Token = {
	timbre: string;
	realm_access: {
		roles: string[];
	};
};
export const SESSION_ITEM = '__SESSION_ITEM__';

export const getToken = () =>
	window.localStorage ? window.localStorage.getItem(SESSION_ITEM) : null;

export const removeToken = () => window.localStorage.removeItem(SESSION_ITEM);

export const setToken = (token: string) =>
	window.localStorage.setItem(SESSION_ITEM, token);

export const getAuthPropsFromToken = (tokenParsed: Token) => {
	const roles = tokenParsed.realm_access.roles;
	const stamp = tokenParsed.timbre;
	return { roles, stamp };
};

export const isTokenValid = (token: string) =>
	new Date().getTime() / 1000 < (jwt_decode(token) as any).exp;
