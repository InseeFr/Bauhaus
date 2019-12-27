import React from 'react';
import { Link } from 'react-router-dom';
import D from 'js/i18n';
import adminLogo from 'img/admin.svg';

import { ADMIN } from 'js/utils/auth/roles';
import Auth from 'js/utils/auth/components/auth';
import './app.scss';

function App() {
	document.title = 'Bauhaus';

	const apps = process.env.REACT_APP_APPLICATIONS.split(',').map(appName => {
		const app = appName.trim();
		return (
			<div key={appName} className={appName}>
				<Link to={'/' + app}>
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
			<Auth roles={[ADMIN]}>
				<div className="bauhaus-app">
					<Link to="/administration/roles">
						<h2 className="items page-title page-title-link">
							{D.authorizationManagementTitle}
						</h2>
						<img src={adminLogo} alt="Roles" className="img" />
					</Link>
				</div>
			</Auth>
		</div>
	);
}

export default App;
