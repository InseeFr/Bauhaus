import React from 'react';
import { Link } from 'react-router-dom';
import D from 'js/i18n';
import adminLogo from 'img/admin.svg';
import { getEnvVar } from 'js/utils/env';

import { Auth } from 'bauhaus-utilities';
import 'bootstrap/dist/css/bootstrap.css';
import './app.scss';

function App() {
	document.title = 'Bauhaus';

	const apps = getEnvVar('APPLICATIONS')
		.split(',')
		.map(appName => {
			const app = appName.trim();
			const defaultRoute = require(`./applications/${app}/config`).defaultRoute;
			return (
				<div key={appName} className={appName}>
					<Link to={'/' + app + defaultRoute}>
						<h2 className="items page-title page-title-link">
							{D[app + 'Title']}
						</h2>
						<img src={require(`img/${app}_blanc.svg`)} alt={app} />
					</Link>
				</div>
			);
		});

	return (
		<div className="home-page-links home-page-links__grid-3">
			{apps}
			<Auth.AuthGuard roles={[Auth.ADMIN]}>
				<div className="bauhaus-app">
					<Link to="/habilitation">
						<h2 className="items page-title page-title-link">
							{D.authorizationManagementTitle}
						</h2>
						<img src={adminLogo} alt="Roles" className="img" />
					</Link>
				</div>
			</Auth.AuthGuard>
		</div>
	);
}

export default App;
