import { render } from '@testing-library/react';
import { ReactNode } from 'react';
import { MemoryRouter } from 'react-router-dom';

import { MODULE, PRIVILEGE, STRATEGY } from '@utils/hooks/users';

import { AppContextProvider } from '../application/app-context';

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

export const renderWithRouter = (
	component: ReactNode,
	initialEntries: string[] = ['/'],
) => {
	return render(
		<MemoryRouter initialEntries={initialEntries}>{component}</MemoryRouter>,
	);
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
