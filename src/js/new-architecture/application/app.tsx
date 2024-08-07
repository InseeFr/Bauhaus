import { Link } from 'react-router-dom';
import D from '../../i18n';
import 'bootstrap/dist/css/bootstrap.css';
import './app.scss';
import { useSelector } from 'react-redux';
import { useTitle } from '../../utils';

function App() {
	useTitle();
	const modules = useSelector((state) => {
		return (state as any).app.properties?.modules ?? [];
	});

	const apps = modules.map((appName: string) => {
		const app = appName.trim();
		const defaultRoute =
			require(`../../applications/${app}/config`).defaultRoute;
		return (
			<div key={appName} className={appName}>
				<Link to={'/' + app + defaultRoute}>
					<h2 className="items page-title page-title-link">
						{D[app + 'Title']}
					</h2>
					<img src={`/img/${app}_blanc.svg`} alt={app} />
				</Link>
			</div>
		);
	});

	return <div className="home-page-links home-page-links__grid-3">{apps}</div>;
}

export default App;
