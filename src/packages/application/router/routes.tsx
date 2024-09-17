import { Suspense, lazy, useEffect, useMemo } from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';

import auth from '../../auth/hoc';

import App from '../app';
import { Loading, NotFound, UnderMaintenance } from '../../components';
import { useAppContext } from '../app-context';

type ModuleHomePage = {
	pageName: string;
	pages: Record<string, any>;
	activeModules: string[];
};
const ModuleHomePage = ({
	pageName,
	pages,
	activeModules,
}: Readonly<ModuleHomePage>) => {
	if (!activeModules.includes(pageName)) {
		return UnderMaintenance;
	}
	if (!pages[pageName]) {
		return NotFound;
	}
	const Component = pages[pageName];

	useEffect(() => {
		// @ts-ignore
		document.getElementById('root-app').removeAttribute('class');
		// @ts-ignore
		document.getElementById('root-app').classList.add(pageName);
	}, []);
	return <Component />;
};

const getHomePage = (pages: Record<string, string>) => {
	if (!pages) {
		return null;
	}

	const pageNames = Object.keys(pages);
	return pageNames.length === 1 ? (
		<Redirect to={'/' + pageNames[0]} />
	) : (
		<App />
	);
};
export default auth(() => {
	const {
		properties: { activeModules },
	} = useAppContext();
	const {
		properties: { modules },
	} = useAppContext();
	const pages = useMemo(() => {
		return modules.reduce((acc: Record<string, any>, appName: string) => {
			const app = appName.trim();
			return {
				...acc,
				[app]: lazy(() => import(`../../modules-${app}/routes/index.tsx`)),
			};
		}, []);
	}, [modules]);

	const homePage = getHomePage(pages);

	if (!homePage) {
		return null;
	}

	return (
		<Suspense fallback={<Loading />}>
			<Switch>
				<Route exact path="/">
					{homePage}
				</Route>

				<Route path="/(concept|concepts|collections|collection)">
					<ModuleHomePage
						pageName="concepts"
						pages={pages}
						activeModules={activeModules}
					/>
				</Route>
				<Route path="/classifications">
					<ModuleHomePage
						pageName="classifications"
						pages={pages}
						activeModules={activeModules}
					/>
				</Route>
				<Route path="/operations">
					<ModuleHomePage
						pageName="operations"
						pages={pages}
						activeModules={activeModules}
					/>
				</Route>
				<Route path="/structures">
					<ModuleHomePage
						pageName="structures"
						pages={pages}
						activeModules={activeModules}
					/>
				</Route>

				<Route path="/datasets">
					<ModuleHomePage
						pageName="datasets"
						pages={pages}
						activeModules={activeModules}
					/>
				</Route>
				<Route path="/(codelists|codelists-partial)">
					<ModuleHomePage
						pageName="codelists"
						pages={pages}
						activeModules={activeModules}
					/>
				</Route>

				<Route path="*">
					<NotFound />
				</Route>
			</Switch>
		</Suspense>
	);
});
