import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render } from '@testing-library/react';
import { ReactNode } from 'react';
import { MemoryRouter } from 'react-router-dom';

import { AppContextProvider } from '../application/app-context';

export const renderWithQueryClient = (ui: React.ReactElement) => {
	const queryClient = new QueryClient();
	return render(
		<QueryClientProvider client={queryClient}>{ui}</QueryClientProvider>,
	);
};

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
