import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render } from '@testing-library/react';
import { PropsWithChildren, ReactNode } from 'react';
import { MemoryRouter } from 'react-router-dom';

import { MODULE, PRIVILEGE, STRATEGY } from '@sdk/users-api';

import { AppContextProvider } from '../application/app-context';

export const renderWithReactQuery = ({
	children,
}: PropsWithChildren<never>) => {
	const queryClient = new QueryClient();
	return (
		<QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
	);
};
export const mockReactQuery = (data: unknown) => {
	vi.doMock('@tanstack/react-query', async () => {
		const actual = await vi.importActual<
			typeof import('@tanstack/react-query')
		>('@tanstack/react-query');
		return {
			...actual,
			useQuery: vi.fn().mockReturnValue({
				isLoading: false,
				data,
			}),
		};
	});
};

export const mockReactQueryForRbac = (
	rbac: {
		application: MODULE;
		privileges: { privilege: PRIVILEGE; strategy: STRATEGY }[];
	}[],
) => {
	mockReactQuery(rbac);
};

export const renderWithRouter = (component: ReactNode) => {
	return render(<MemoryRouter>{component}</MemoryRouter>);
};

export const renderWithAppContext = (
	component: ReactNode,
	withRouter = true,
) => {
	if (!withRouter) {
		return render(
			<AppContextProvider
				lg1="fr"
				lg2="lg2"
				version="2.0.0"
				properties={{} as any}
			>
				{component}
			</AppContextProvider>,
		);
	}
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
