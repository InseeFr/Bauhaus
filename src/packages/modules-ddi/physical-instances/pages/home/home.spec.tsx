import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, screen } from '@testing-library/react';
import { ReactNode } from 'react';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it, vi } from 'vitest';

import { usePhysicalInstances } from '../../../hooks/usePhysicalInstances';
import { Component } from './home';

vi.mock('../../../hooks/usePhysicalInstances');
vi.mock('@utils/hooks/useTitle');
vi.mock('./menu', () => ({
	HomePageMenu: () => <div data-testid="home-page-menu">Menu</div>,
}));
vi.mock('../../../deprecated-locales', () => ({
	default: {
		ddiTitle: 'DDI Title',
		physicalInstanceTitle: 'Physical Instance Title',
		physicalInstancSearcheTitle: 'Physical Instance Search Title',
	},
}));

const createWrapper = () => {
	const queryClient = new QueryClient({
		defaultOptions: {
			queries: {
				retry: false,
			},
		},
	});
	return ({ children }: { children: ReactNode }) => (
		<QueryClientProvider client={queryClient}>
			<MemoryRouter>{children}</MemoryRouter>
		</QueryClientProvider>
	);
};

describe('Home Component', () => {
	it('should show loading state when data is loading', () => {
		vi.mocked(usePhysicalInstances).mockReturnValue({
			data: undefined,
			isLoading: true,
			isSuccess: false,
			isError: false,
			error: null,
		} as any);

		render(<Component />, { wrapper: createWrapper() });

		expect(screen.getByText('Loading in progress...')).toBeInTheDocument();
	});

	it('should render SearchableList when data is loaded', () => {
		const mockData = [
			{ id: '1', name: 'Physical Instance 1' },
			{ id: '2', name: 'Physical Instance 2' },
		];

		vi.mocked(usePhysicalInstances).mockReturnValue({
			data: mockData,
			isLoading: false,
			isSuccess: true,
			isError: false,
			error: null,
		} as any);

		render(<Component />, { wrapper: createWrapper() });

		expect(screen.getByText('Physical Instances - Search')).toBeInTheDocument();
		expect(
			screen.queryByText('Loading in progress...'),
		).not.toBeInTheDocument();
	});

	it('should render empty list when no data', () => {
		vi.mocked(usePhysicalInstances).mockReturnValue({
			data: [],
			isLoading: false,
			isSuccess: true,
			isError: false,
			error: null,
		} as any);

		render(<Component />, { wrapper: createWrapper() });

		expect(screen.getByText('Physical Instances - Search')).toBeInTheDocument();
		expect(
			screen.queryByText('Loading in progress...'),
		).not.toBeInTheDocument();
	});

	it('should handle undefined data gracefully', () => {
		vi.mocked(usePhysicalInstances).mockReturnValue({
			data: undefined,
			isLoading: false,
			isSuccess: true,
			isError: false,
			error: null,
		} as any);

		render(<Component />, { wrapper: createWrapper() });

		expect(screen.getByText('Physical Instances - Search')).toBeInTheDocument();
		expect(
			screen.queryByText('Loading in progress...'),
		).not.toBeInTheDocument();
	});
});
