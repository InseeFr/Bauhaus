import 'primereact/resources/themes/lara-light-blue/theme.css';
import { Link } from 'react-router-dom';

import { useTitle } from '@utils/hooks/useTitle';
import { usePrivileges } from '@utils/hooks/users';

import { hasAccessToModule } from '../auth/components/auth';
import D from '../deprecated-locales';
import '../styles/bootstrap.scss';
import 'primeflex/primeflex.css';
import 'primeicons/primeicons.css';

import { useAppContext } from './app-context';
import './app.scss';

const App = () => {
	useTitle();

	const { privileges = [] } = usePrivileges();

	const {
		properties: { modules },
	} = useAppContext();

	const apps = modules
		.filter((app) => {
			return hasAccessToModule(app, privileges);
		})
		.map((appName) => {
			const app = appName.trim();

			return (
				<div key={appName} className={appName}>
					<Link to={'/' + app}>
						<h2 className="items page-title page-title-link">
							{D[app + 'Title']}
						</h2>
						<img src={`/img/${app}_blanc.svg`} alt="" />
					</Link>
				</div>
			);
		});

	return <div className="home-page-links home-page-links__grid-3">{apps}</div>;
};

export default App;
