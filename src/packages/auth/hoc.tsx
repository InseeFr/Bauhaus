import { connect } from 'react-redux';
import LoginNoAuth from './no-auth/login';
import LoginOidcComponent from './open-id-connect-auth/use-oidc';
import { NO_AUTH, OPEN_ID_CONNECT_AUTH } from './constants';
import { getPermission } from '../redux/selectors';
import { ReduxModel } from '../redux/model';

const auth = (WrappedComponent: any) => {
	const AuthComponent = ({
		authType,
		roles,
	}: {
		authType: string;
		roles: string[] | null;
	}) => {
		if (authType === OPEN_ID_CONNECT_AUTH)
			return <LoginOidcComponent WrappedComponent={WrappedComponent} />;

		if (roles) return <WrappedComponent />;

		if (authType === NO_AUTH) {
			return <LoginNoAuth />;
		}

		return <div>Error</div>;
	};

	return connect(mapStateToProps)(AuthComponent);
};

export const mapStateToProps = (state: ReduxModel) => {
	const { authType, roles, stamp } = getPermission(state);
	if (stamp) return { authType, roles };
	return { authType, roles: null };
};

export default auth;
