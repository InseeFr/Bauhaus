import { PropsWithChildren } from 'react';
import 'react-app-polyfill/stable';
import { useLocation } from 'react-router-dom';

import Auth from '../../auth/components/auth';
import { useOidc } from '../../auth/create-oidc';
import { ADMIN } from '../../auth/roles';
import D from '../../i18n';
import { useAppContext } from '../app-context';
import Routes from './routes';

export const RBACLink = ({ children }: PropsWithChildren<unknown>) => {
	const { isUserLoggedIn, logout } = useOidc();

	const logoutAndRemoveFromStorage = () => {
		if (isUserLoggedIn) {
			logout({
				redirectTo: 'specific url',
				url: '/logout',
			});
		}
	};

	const location = useLocation();
	const {
		properties: { authorizationHost },
	} = useAppContext();
	const { version } = useAppContext();
	const footer = `${import.meta.env.VITE_NAME} - IHM ${import.meta.env.VITE_VERSION} - API ${version}`;

	const isHomePage = location.pathname === '/';

	return (
		<>
			<div id="root-app">{children}</div>

			<footer className="text-center" style={{ marginTop: '50px' }}>
				<p>
					<img width="100" src="/img/logo_noir.svg" alt="application logo" />
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
	return <Routes />;
};

export default Root;
