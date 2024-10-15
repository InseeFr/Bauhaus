import { connect } from 'react-redux';
import LoginNoAuth from './no-auth/login';
import LoggedWrapper, { LoginWrapper } from './open-id-connect-auth/use-oidc';
import { NO_AUTH, OPEN_ID_CONNECT_AUTH } from './constants';
import { getPermission } from '../redux/selectors';
import { ReduxModel } from '../redux/model';
import { useOidc } from './create-oidc';

const auth = (WrappedComponent: any) => {
	const AuthComponent = ({
		authType,
		roles,
	}: {
		authType: string;
		roles: string[] | null;
	}) => {
		if (authType === OPEN_ID_CONNECT_AUTH) {
			const { isUserLoggedIn } = useOidc();
			if (!isUserLoggedIn)
				return <LoginWrapper WrappedComponent={WrappedComponent} />;
			else return <LoggedWrapper WrappedComponent={WrappedComponent} />;
		}

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
