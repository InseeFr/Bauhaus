import 'primereact/resources/themes/lara-light-blue/theme.css';
import { Link } from 'react-router-dom';
import { useMemo } from 'react';

import { useTitle } from '@utils/hooks/useTitle';
import { usePrivileges } from '@utils/hooks/users';

import { hasAccessToModule } from '../auth/components/auth';
import D from '../deprecated-locales';
import '../styles/bootstrap.scss';
import 'primeflex/primeflex.css';
import 'primeicons/primeicons.css';

import { useAppContext } from './app-context';
import './app.scss';

const AppCard = ({ app }: { app: string }) => {
	const getAppTitle = (appKey: string): string => {
		const titleKey = `${appKey}Title`;
		return D[titleKey as keyof typeof D] || appKey;
	};

	return (
		<div className={app}>
			<Link to={`/${app}`}>
				<h2 className="items page-title page-title-link">{getAppTitle(app)}</h2>
				<img src={`/img/${app}_blanc.svg`} alt="" loading="lazy" />
			</Link>
		</div>
	);
};

const App = () => {
	useTitle();

	const { privileges = [] } = usePrivileges();
	const {
		properties: { modules },
	} = useAppContext();

	const accessibleModules = useMemo(() => {
		return modules.filter((app) => hasAccessToModule(app, privileges));
	}, [modules, privileges]);

	const appCards = useMemo(() => {
		return accessibleModules.map((appName) => {
			const app = appName.trim();
			return <AppCard key={app} app={app} />;
		});
	}, [accessibleModules]);

	return (
		<div className="home-page-links home-page-links__grid-3">{appCards}</div>
	);
};

export default App;
