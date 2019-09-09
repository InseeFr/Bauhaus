import React from 'react';
import { Link } from 'react-router-dom';
import D from 'js/i18n';
import adminLogo from 'img/admin.png';
import { ADMIN } from 'js/utils/auth/roles';
import Auth from 'js/utils/auth/components/auth';

function App() {
	document.title = 'Bauhaus';

	const apps = process.env.REACT_APP_APPLICATIONS.split(',').map(appName => {
		const app = appName.trim();
		return (
			<li key={appName}>
				<Link to={'/' + app}>
					<h2 className="items page-title page-title-link">
						{D[app + 'Title']}
					</h2>
					<img src={require(`img/${app}.jpg`)} alt={app} />
				</Link>
			</li>
		);
	});
	return (
		<>
			<div className="centered page-title">
				<h1>{D.welcome}</h1>
			</div>
			<ul className="home-page-links">
				{apps}
				<Auth roles={[ADMIN]}>
					<li>
						<Link to="/administration/roles">
							<h2 className="items page-title page-title-link">
								{D.roleTitle}
							</h2>
							<img src={adminLogo} alt="Roles" className="img" />
						</Link>
					</li>
				</Auth>
			</ul>
		</>
	);
}

export default App;
