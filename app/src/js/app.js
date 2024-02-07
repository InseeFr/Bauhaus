import React from 'react';
import { Link } from 'react-router-dom';
import D from 'js/i18n';
import 'bootstrap/dist/css/bootstrap.css';
import './app.scss';
import { useSelector } from 'react-redux';

function App() {
	const modules = useSelector((state) => {
		return state.app.properties?.modules ?? [];
	});

	document.title = 'Bauhaus';

	const apps = modules.map((appName) => {
		const app = appName.trim();
		const defaultRoute = require(`./applications/${app}/config`).defaultRoute;
		return (
			<div key={appName} className={appName}>
				<Link to={'/' + app + defaultRoute}>
					<h2 className="items page-title page-title-link">
						{D[app + 'Title']}
					</h2>
					<img src={require(`img/${app}_blanc.svg`).default} alt={app} />
				</Link>
			</div>
		);
	});

	return <div className="home-page-links home-page-links__grid-3">{apps}</div>;
}

export default App;
