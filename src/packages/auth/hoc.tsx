import { connect } from 'react-redux';

import { ReduxModel } from '../redux/model';
import { getPermission } from '../redux/selectors';
import { NO_AUTH, OPEN_ID_CONNECT_AUTH } from './constants';
import { useOidc } from './create-oidc';
import LoginNoAuth from './no-auth/login';
import LoggedInWrapper, {
	LoginComponent,
} from './open-id-connect-auth/use-oidc';

interface AuthProps {
	authType: string;
	roles: string[] | null;
}

export const withAuth = (WrappedComponent: () => JSX.Element) => {
	const AuthComponent = ({ authType, roles }: AuthProps) => {
		const { isUserLoggedIn } = useOidc();
		if (authType === OPEN_ID_CONNECT_AUTH) {
			if (!isUserLoggedIn) return <LoginComponent />;
			else return <LoggedInWrapper WrappedComponent={WrappedComponent} />;
		}

		if (roles && roles.length > 0) {
			return <WrappedComponent />;
		}

		if (authType === NO_AUTH) {
			return <LoginNoAuth />;
		}

		return (
			<div role="alert" aria-live="polite">
				Erreur d'authentification
			</div>
		);
	};

	return connect(mapStateToProps)(AuthComponent);
};

export const mapStateToProps = (state: ReduxModel) => {
	const { authType, roles, stamp } = getPermission(state);
	if (stamp) return { authType, roles };
	return { authType, roles: null };
};
