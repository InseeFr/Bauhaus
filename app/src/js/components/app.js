import React from 'react';
import { Link } from 'react-router-dom';
import D from 'js/i18n';

function App() {
	document.title = 'Bauhaus';

	return (
		<>
			<div className="centered page-title">
				<h1>{D.welcome}</h1>
			</div>
			<ul className="home-page-links">
				{process.env.REACT_APP_APPLICATIONS.split(',').map(appName => {
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
				})}
			</ul>
		</>
	);
}

export default App;
