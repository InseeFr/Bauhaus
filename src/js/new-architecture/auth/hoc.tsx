import { connect } from 'react-redux';
import { Auth } from '../../utils';
import LoginNoAuth from './no-auth/login';
import LoginOpenIDConnect from './open-id-connect-auth/login-container';
import { NO_AUTH, OPEN_ID_CONNECT_AUTH } from './constants';

const auth = (WrappedComponent: any) => {
	const AuthComponent = ({
		authType,
		roles,
	}: {
		authType: string;
		roles: string[] | null;
	}) => {
		if (authType === OPEN_ID_CONNECT_AUTH)
			return <LoginOpenIDConnect WrappedComponent={WrappedComponent} />;

		if (roles) return <WrappedComponent />;
		switch (authType) {
			case NO_AUTH:
				return <LoginNoAuth />;
			default:
				return <div>Error</div>;
		}
	};

	return connect(mapStateToProps)(AuthComponent);
};

export const mapStateToProps = (state: any) => {
	const { authType, roles, stamp } = Auth.getPermission(state);
	if (stamp) return { authType, roles };
	return { authType, roles: null };
};

export default auth;
