import { PropsWithChildren } from 'react';
import 'react-app-polyfill/stable';

import { useOidc } from '../../auth/create-oidc';
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

	const { version } = useAppContext();
	const footer = `${import.meta.env.VITE_NAME} - IHM ${import.meta.env.VITE_VERSION} - API ${version}`;

	return (
		<>
			<div id="root-app">{children}</div>

			<footer className="text-center" style={{ marginTop: '50px' }}>
				<p>
					<img width="100" src="/img/logo_noir.svg" alt="application logo" />
					{footer}
				</p>
				<button
					onClick={logoutAndRemoveFromStorage}
					className="btn btn-primary"
				>
					{D.authentication.logout}
				</button>
			</footer>
		</>
	);
};
const Root = () => {
	return <Routes />;
};

export default Root;
