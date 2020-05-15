import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import Keycloak from 'keycloak';
import { Loading } from '@inseefr/wilco';
import { saveUserProps } from 'js/actions/app';
import { Auth } from 'bauhaus-utilities';

const kcConfig = `${window.location.origin}/keycloak.json`;

class LoginOpenIDConnect extends Component {
	constructor() {
		super();
		this.kc = Keycloak(kcConfig);
		this.initLogin = this.initLogin.bind(this);
	}

	initLogin() {
		const redirectUri = window.location.href.replace(
			window.location.search,
			''
		);
		this.kc.redirectUri = redirectUri;
		this.kc
			.init({
				onLoad: 'login-required',
				responseMode: 'query',
				checkLoginIframe: false,
			})
			.success(() => {
				this.props.saveUserProps(
					Auth.getAuthPropsFromToken(this.kc.tokenParsed)
				);
				this.kc.token && Auth.setToken(this.kc.token);
				setInterval(() => this.refreshToken(), 20000);
				const { history } = this.props;
				history.push({ pathname: history.location.pathname, state: 'init' });
			})
			.error(e => console.log('erreur initLogin', e));
	}

	refreshToken() {
		this.kc
			.updateToken(30)
			.success(isUpdated => {
				if (isUpdated) {
					this.kc.token && Auth.setToken(this.kc.token);
					this.props.saveUserProps(
						Auth.getAuthPropsFromToken(this.kc.tokenParsed)
					);
				}
			})
			.error(error => this.initLogin());
	}

	componentWillMount() {
		this.initLogin();
	}

	render() {
		const { authenticated } = this.props;
		const { WrappedComponent } = this.props;
		const token = Auth.getToken();
		if (authenticated && token && Auth.isTokenValid(token))
			return <WrappedComponent />;
		return <Loading textType="authentification" />;
	}
}

export const mapStateToProps = state => ({
	authenticated: Auth.getPermission(state).stamp,
});

const mapDispatchToProps = {
	saveUserProps,
};

export default withRouter(
	connect(
		mapStateToProps,
		mapDispatchToProps
	)(LoginOpenIDConnect)
);
