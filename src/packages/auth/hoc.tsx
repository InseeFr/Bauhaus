import { useSelector } from 'react-redux';

import { getPermission } from '../redux/selectors';
import { NO_AUTH, OPEN_ID_CONNECT_AUTH } from './constants';
import { useOidc } from './create-oidc';
import LoggedInWrapper, {
	LoginComponent,
} from './open-id-connect-auth/use-oidc';

const auth = (WrappedComponent: () => JSX.Element) => {
	const AuthComponent = () => {
		const { authType } = useSelector(getPermission);
		const { isUserLoggedIn } = useOidc();
		if (authType === OPEN_ID_CONNECT_AUTH) {
			if (!isUserLoggedIn) return <LoginComponent />;
			else return <LoggedInWrapper WrappedComponent={WrappedComponent} />;
		}

		if (authType === NO_AUTH) {
			return <WrappedComponent />;
		}

		return <div>Error</div>;
	};

	return AuthComponent;
};

export default auth;
