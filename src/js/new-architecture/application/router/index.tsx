import { BrowserRouter as Router, useLocation } from 'react-router-dom';
import Routes from './routes';
import bauhausLogo from '../../../../img/logo_noir.svg';
import { getEnvVar } from '../../utils/env';
import D from '../../i18n';
import 'react-app-polyfill/stable';
import { useSelector } from 'react-redux';
import { removeToken } from '../../../utils/auth/open-id-connect-auth/token-utils';
import { PropsWithChildren } from 'react';
import { Auth } from '../../../utils';

const logout = () => {
	removeToken();
	// @ts-ignore
	window.location = window.location.origin;
};

export const RBACLink = ({ children }: PropsWithChildren<{}>) => {
	const location = useLocation();
	const authorizationHost = useSelector(
		(state) => (state as any).app.properties.authorizationHost
	);
	const version = useSelector((state) => (state as any).app.version);
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
					<button onClick={logout} className="btn btn-primary">
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
			<RBACLink>
				<Routes />
			</RBACLink>
		</Router>
	);
};

export default Root;
