import React, { Component } from 'react';
import { connect } from 'react-redux';
import LoginNoAuth from 'js/applications/auth/no-auth/login';
import LoginBasic from 'js/applications/auth/basic-auth/login-container';
import LoginOpenIDConnect from 'js/applications/auth/open-id-connect-auth/login-container';
import * as Impl from 'js/utils/auth/auth-impl';
import { Auth } from 'bauhaus-utilities';

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

export const mapStateToProps = state => {
	const { authType, roles, stamp } = Auth.getPermission(state);
	if (stamp) return { authType, roles };
	return { authType, roles: null };
};

export default auth;
