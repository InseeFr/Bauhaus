import React, { Component } from 'react';
import { connect } from 'react-redux';
import Login from 'js/components/auth/fake-auth/login';
import * as Impl from 'js/components/auth/auth-impl';

const auth = WrappedComponent => {
	class AuthComponent extends Component {
		componentDidUpdate(nextProps) {
			return nextProps !== this.props;
		}
		render() {
			const { authType, role } = this.props;
			if (role) return <WrappedComponent {...this.props} />;
			switch (authType) {
				case Impl.NO_AUTH:
					return <WrappedComponent {...this.props} />;
				case Impl.FAKE_AUTH:
					return <Login />;
				case Impl.BASIC_AUTH:
				case Impl.OPEN_ID_CONNECT_AUTH:
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
	if (auth.user) return { authType, role: auth.user.role };
	return { authType, role: null };
};

export default auth;
