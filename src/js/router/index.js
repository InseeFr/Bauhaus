import { BrowserRouter as Router, useLocation } from 'react-router-dom';
import Routes from './routes';
import bauhausLogo from '../../img/logo_noir.svg';
import { getEnvVar } from '../utils/env';
import D from '../new-architecture/i18n';
import 'react-app-polyfill/stable';
import { useSelector } from 'react-redux';
import { Auth } from '../utils';
import { removeToken } from '../utils/auth/open-id-connect-auth/token-utils';
import {
	useOidc,
	OidcProvider,
} from '../new-architecture/auth/createReactOidc';

export const RBACLink = ({ children }) => {
	const { isUserLoggedIn, logout } = useOidc();

	const logoutAndRemoveFromStorage = () => {
		removeToken();
		if (isUserLoggedIn) logout({ redirectTo: 'home' });
	};

	const location = useLocation();
	const authorizationHost = useSelector(
		(state) => state.app.properties.authorizationHost
	);
	const version = useSelector((state) => state.app.version);
	const footer = `${getEnvVar('NAME')} - Front ${getEnvVar(
		'VERSION'
	)} - API ${version}`;

	const isHomePage = location.pathname === '/';

	return (
		<>
			<div id="root-app">{children}</div>

			<footer className="text-center" style={{ marginTop: '50px' }}>
				<p>
					<img width="100" src={bauhausLogo} alt="application logo" />
					{footer}
				</p>
				<div style={{ display: 'flex', justifyContent: 'center', gap: '5px' }}>
					<button
						onClick={logoutAndRemoveFromStorage}
						className="btn btn-primary"
					>
						{D.authentication.logout}
					</button>
					<Auth.AuthGuard roles={[Auth.ADMIN]}>
						{isHomePage && (
							<a
								className="btn btn-primary"
								rel="noreferrer noopener"
								target="_blank"
								href={authorizationHost}
							>
								{D.authentication.title}
							</a>
						)}
					</Auth.AuthGuard>
				</div>
			</footer>
		</>
	);
};
const Root = () => {
	return (
		<Router>
			<OidcProvider>
				<RBACLink>
					<Routes />
				</RBACLink>
			</OidcProvider>
		</Router>
	);
};

export default Root;
