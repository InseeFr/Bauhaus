import { Link } from 'react-router-dom';
import D from '../deprecated-locales';
import 'bootstrap/dist/css/bootstrap.css';
import './app.scss';
import { useTitle } from '../utils/hooks/useTitle';
import { useAppContext } from './app-context';

function App() {
	useTitle();
	const { properties: { modules = [] } = {} } = useAppContext();

	const apps = modules.map((appName: string) => {
		const app = appName.trim();
		const defaultRoute = require(`../modules-${app}/config`).defaultRoute;
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
