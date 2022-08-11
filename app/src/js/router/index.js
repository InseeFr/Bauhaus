import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import Routes from './routes';
import bauhausLogo from 'img/logo_noir.svg';
import { getEnvVar } from 'js/utils/env';
import D from 'js/i18n';

import 'react-app-polyfill/stable';
import { useSelector } from 'react-redux';

const Root = () => {
	const authorizationHost = useSelector(state => state.app.properties.authorizationHost);
	const footer = `${getEnvVar('NAME')} - ${getEnvVar('VERSION')}`;
	return (
		<>
			<div id="root-app">
				<Router>
					<Routes />
				</Router>
			</div>
			<footer className="text-center" style={{ marginTop: '50px' }}>
				<p>
					<img width="100" src={bauhausLogo} alt="application logo" />

					{footer}
				</p>
				<p><a rel="noreferrer noopener" target="_blank" href={authorizationHost}>{D.authorizationTitle}</a> </p>
			</footer>
		</>
	);
};

export default Root;
