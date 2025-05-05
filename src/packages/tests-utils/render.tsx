import { render } from '@testing-library/react';
import { ReactNode } from 'react';
import { MemoryRouter } from 'react-router-dom';

import { AppContextProvider } from '../application/app-context';

export const renderWithRouter = (component: ReactNode) => {
	return render(<MemoryRouter>{component}</MemoryRouter>);
};

export const renderWithAppContext = (component: ReactNode) => {
	return renderWithRouter(
		<AppContextProvider
			lg1="fr"
			lg2="lg2"
			version="2.0.0"
			properties={{} as any}
		>
			{component}
		</AppContextProvider>,
	);
};
