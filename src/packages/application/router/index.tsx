import { BrowserRouter as Router, useLocation } from 'react-router-dom';
import Routes from './routes';
//@ts-ignore
import bauhausLogo from '../../../img/logo_noir.svg';
import { getEnvVar } from '../../utils/env';
import D from '../../i18n';
import 'react-app-polyfill/stable';
import { PropsWithChildren } from 'react';
import Auth from '../../auth/components/auth';
import { removeToken } from '../../auth/open-id-connect-auth/token-utils';
import { ADMIN } from '../../auth/roles';
import { useAppContext } from '../app-context';
import { useOidc } from '../../auth/create-oidc';

export const RBACLink = ({ children }: PropsWithChildren<{}>) => {
	const { isUserLoggedIn, logout } = useOidc();

	const logoutAndRemoveFromStorage = () => {
		removeToken();
		if (isUserLoggedIn) {
			logout({ redirectTo: 'home' });
		}
	};

	const location = useLocation();
	const {
		properties: { authorizationHost },
	} = useAppContext();
	const { version } = useAppContext();
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
					<Auth roles={[ADMIN]}>
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
					</Auth>
				</div>
			</footer>
		</>
	);
};
const Root = () => {
	return (
		<Router>
			<RBACLink>
				<Routes />
			</RBACLink>
		</Router>
	);
};

export default Root;
