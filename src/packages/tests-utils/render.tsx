import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import React from 'react';
import { AppContextProvider } from '../application/app-context';

export const renderWithRouter = (component: React.ReactNode) => {
	return render(<MemoryRouter>{component}</MemoryRouter>);
};

export const renderWithAppContext = (component: React.ReactNode) => {
	return renderWithRouter(
		<AppContextProvider lg1="fr" lg2="lg2">
			{component}
		</AppContextProvider>
	);
};
