import React, { useEffect, useCallback } from 'react';
import { connect } from 'react-redux';
import { useHistory } from 'react-router-dom';
import Keycloak from 'keycloak';
import { Loading } from '@inseefr/wilco';
import { saveUserProps } from 'js/actions/app';
import { Auth } from 'bauhaus-utilities';

const kcConfig = `${window.location.origin}/keycloak.json`;

const kc = Keycloak(kcConfig);
const LoginOpenIDConnect = ({ saveUserProps, authenticated, WrappedComponent }) => {
	const history = useHistory()
	const refreshToken = useCallback(() => {
		kc
			.updateToken(30)
			.success(isUpdated => {
				if (isUpdated) {
					kc.token && Auth.setToken(kc.token);
					saveUserProps(
						Auth.getAuthPropsFromToken(kc.tokenParsed)
					);
				}
			})
			.error(error => this.initLogin());
	}, [saveUserProps])


	const initLogin = useCallback(() => {
		const redirectUri = window.location.href.replace(
			window.location.search,
			''
		);
		kc.redirectUri = redirectUri;
		kc
			.init({
				onLoad: 'login-required',
				responseMode: 'query',
				checkLoginIframe: false,
			})
			.success(() => {
				saveUserProps(
					Auth.getAuthPropsFromToken(kc.tokenParsed)
				);
				kc.token && Auth.setToken(kc.token);
				setInterval(() => refreshToken(), 20000);
				history.push({ pathname: history.location.pathname, state: 'init' });
			})
			.error(e => console.log('erreur initLogin', e));
	}, [history, refreshToken, saveUserProps]);

	useEffect(() => {
		initLogin();
	}, [initLogin])

	const token = Auth.getToken();
	if (authenticated && token && Auth.isTokenValid(token))
		return <WrappedComponent />;
	return <Loading textType="authentification" />;
}

export const mapStateToProps = state => ({
	authenticated: Auth.getPermission(state).stamp,
});

const mapDispatchToProps = {
	saveUserProps,
};

export default
	connect(
		mapStateToProps,
		mapDispatchToProps
	)(LoginOpenIDConnect)

