import React from 'react';
import { BrowserRouter as Router,useLocation } from 'react-router-dom';
import Routes from './routes';
import bauhausLogo from 'img/logo_noir.svg';
import { getEnvVar } from 'js/utils/env';
import D from 'js/i18n';

import 'react-app-polyfill/stable';
import { useSelector } from 'react-redux';
import { Auth } from 'bauhaus-utilities';

const footer = `${getEnvVar('NAME')} - ${getEnvVar('VERSION')}`;


const RBACLink = ({ children }) => {
	const authorizationHost = useSelector(state => state.app.properties.authorizationHost);

	const location = useLocation();
	const isHomePage = location.pathname === '/';

	return (
		<>
			<div id="root-app">
				{children}
			</div>

			<footer className="text-center" style={{ marginTop: '50px' }}>
				<p>
					<img width="100" src={bauhausLogo} alt="application logo" />

					{footer}
				</p>
				<Auth.AuthGuard roles={[Auth.ADMIN]}>
					{isHomePage && <p><a rel='noreferrer noopener' target='_blank' href={authorizationHost}>{D.authorizationTitle}</a></p>}
				</Auth.AuthGuard>
			</footer>
		</>
	)
}
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
