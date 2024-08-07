import { connect } from 'react-redux';
import LoginNoAuth from '../../applications/auth/no-auth/login';
import LoginOpenIDConnect from '../../applications/auth/open-id-connect-auth/login-container';
import * as Impl from '../../utils/auth/auth-impl';
import { Auth } from '../../utils';

const auth = (WrappedComponent) => {
	const AuthComponent = ({ authType, roles }) => {
		if (authType === Impl.OPEN_ID_CONNECT_AUTH)
			return <LoginOpenIDConnect WrappedComponent={WrappedComponent} />;

		if (roles) return <WrappedComponent />;
		switch (authType) {
			case Impl.NO_AUTH:
				return <LoginNoAuth />;
			default:
				return <div>Error</div>;
		}
	};

	return connect(mapStateToProps)(AuthComponent);
};

export const mapStateToProps = (state) => {
	const { authType, roles, stamp } = Auth.getPermission(state);
	if (stamp) return { authType, roles };
	return { authType, roles: null };
};

export default auth;
