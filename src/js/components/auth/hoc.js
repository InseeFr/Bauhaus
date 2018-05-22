import React, { Component } from 'react';
import { connect } from 'react-redux';
import LoginNoAuth from 'js/components/auth/no-auth/login';
import LoginBasic from 'js/components/auth/basic-auth/login-container';
import LoginOpenIDConnect from 'js/components/auth/open-id-connect-auth/login-container';
import * as Impl from 'js/utils/auth/auth-impl';

const auth = WrappedComponent => {
	class AuthComponent extends Component {
		render() {
			const { authType, roles } = this.props;
			if (authType === Impl.OPEN_ID_CONNECT_AUTH)
				return <LoginOpenIDConnect WrappedComponent={WrappedComponent} />;

			if (roles) return <WrappedComponent />;
			switch (authType) {
				case Impl.NO_AUTH:
					return <LoginNoAuth />;
				case Impl.BASIC_AUTH:
					return <LoginBasic />;
				default:
					return <div>Error</div>;
			}
		}
	}

	return connect(mapStateToProps)(AuthComponent);
};

const mapStateToProps = state => {
	const auth = state.app.auth;
	const authType = auth.type;
	// Assume that you are authenticated if you have a stamp
	if (auth.user.stamp) return { authType, roles: auth.user.roles };
	return { authType, roles: null };
};

export default auth;
