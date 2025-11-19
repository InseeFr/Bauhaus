import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { renderHook, waitFor } from '@testing-library/react';
import { ReactNode } from 'react';
import { Provider } from 'react-redux';
import { describe, expect, it, vi } from 'vitest';

import { OperationsApi } from '@sdk/operations-api';
import configureStore from '../../redux/configure-store';
import { useUserSeriesList } from './useUserSeriesList';

vi.mock('@sdk/operations-api', () => ({
	OperationsApi: {
		getUserSeriesList: vi.fn(),
	},
}));

const createWrapper = (stamp = 'test-stamp') => {
	const queryClient = new QueryClient({
		defaultOptions: {
			queries: {
				retry: false,
			},
		},
	});

	const store = configureStore({
		app: {
			auth: {
				user: {
					stamp,
				},
			},
		},
	});

	return ({ children }: { children: ReactNode }) => (
		<Provider store={store}>
			<QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
		</Provider>
	);
};

describe('useUserSeriesList', () => {
	it('should return placeholder data and then load series', async () => {
		const mockSeries = [{ id: '1', label: 'Series 1' }];

		vi.mocked(OperationsApi.getUserSeriesList).mockResolvedValue(mockSeries);

		const { result } = renderHook(() => useUserSeriesList(), {
			wrapper: createWrapper(),
		});

		// Initially shows placeholder data
		expect(result.current.series).toEqual([]);

		await waitFor(
			() => {
				expect(result.current.series).toEqual(mockSeries);
			},
			{ timeout: 3000 },
		);
	});

	it('should return series data when API call succeeds', async () => {
		const mockSeries = [
			{ id: '1', label: 'Series 1', idSims: null },
			{ id: '2', label: 'Series 2', idSims: 'sims-1' },
		];
		vi.mocked(OperationsApi.getUserSeriesList).mockResolvedValue(mockSeries);

		const { result } = renderHook(() => useUserSeriesList(), {
			wrapper: createWrapper('test-stamp'),
		});

		// Initially shows placeholder data
		expect(result.current.series).toEqual([]);

		await waitFor(
			() => {
				expect(result.current.series).toEqual(mockSeries);
			},
			{ timeout: 3000 },
		);

		expect(OperationsApi.getUserSeriesList).toHaveBeenCalledWith('test-stamp');
	});

	it('should not fetch series when stamp is not available', async () => {
		const queryClient = new QueryClient({
			defaultOptions: {
				queries: {
					retry: false,
				},
			},
		});

		const store = configureStore({
			app: {
				auth: {
					user: {
						stamp: '',
					},
				},
			},
		});

		const wrapper = ({ children }: { children: ReactNode }) => (
			<Provider store={store}>
				<QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
			</Provider>
		);

		vi.mocked(OperationsApi.getUserSeriesList).mockClear();

		const { result } = renderHook(() => useUserSeriesList(), {
			wrapper,
		});

		await waitFor(() => {
			expect(result.current.isLoading).toBe(false);
		});

		expect(result.current.series).toEqual([]);
		expect(OperationsApi.getUserSeriesList).not.toHaveBeenCalled();
	});

	it('should use placeholder data when loading', () => {
		vi.mocked(OperationsApi.getUserSeriesList).mockImplementation(
			() =>
				new Promise((resolve) => {
					setTimeout(() => resolve([]), 1000);
				}),
		);

		const { result } = renderHook(() => useUserSeriesList(), {
			wrapper: createWrapper('test-stamp'),
		});

		expect(result.current.series).toEqual([]);
	});

	it('should handle API errors gracefully', async () => {
		const error = new Error('API Error');
		vi.mocked(OperationsApi.getUserSeriesList).mockRejectedValue(error);

		const { result } = renderHook(() => useUserSeriesList(), {
			wrapper: createWrapper('test-stamp'),
		});

		await waitFor(() => {
			expect(result.current.isLoading).toBe(false);
		});

		expect(result.current.series).toEqual([]);
	});

	it('should fetch series with correct stamp', async () => {
		const mockSeries1 = [{ id: '1', label: 'Series 1' }];

		vi.mocked(OperationsApi.getUserSeriesList).mockResolvedValue(mockSeries1);

		const { result } = renderHook(() => useUserSeriesList(), {
			wrapper: createWrapper('stamp-1'),
		});

		await waitFor(
			() => {
				expect(result.current.series).toEqual(mockSeries1);
			},
			{ timeout: 3000 },
		);

		expect(OperationsApi.getUserSeriesList).toHaveBeenCalledWith('stamp-1');
	});
});
