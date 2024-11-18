import { useEffect } from 'react';

import { NotFound, UnderMaintenance } from '@components/not-found';

type ModuleHomePage = {
	pageName: string;
	pages: Record<string, any>;
	activeModules: string[];
};
export const ModuleHomePage = ({
	pageName,
	pages,
	activeModules,
}: Readonly<ModuleHomePage>) => {
	if (!activeModules.includes(pageName)) {
		return <UnderMaintenance />;
	}
	if (!pages[pageName]) {
		return <NotFound />;
	}
	const Component = pages[pageName];

	useEffect(() => {
		const rootApp = document.getElementById('root-app');
		if (rootApp !== null) {
			rootApp.removeAttribute('class');
			rootApp.classList.add(pageName);
		}
	}, []);

	return <Component />;
};
