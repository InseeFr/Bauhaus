import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { renderHook, waitFor } from '@testing-library/react';
import { PropsWithChildren } from 'react';
import { vi } from 'vitest';
import { useStamps, useStampsOptions } from './stamps';

// Mock de l'API
vi.mock('../../sdk', () => ({
	StampsApi: {
		getStamps: () => ['stamp1', 'stamp2'],
	},
}));

const queryClient = new QueryClient();
const wrapper = ({ children }: PropsWithChildren<unknown>) => (
	<QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
);

describe('useStamps', () => {
	it('should fetch stamps', async () => {
		const mockStamps = ['stamp1', 'stamp2'];

		const { result } = renderHook(() => useStamps(), { wrapper });

		await waitFor(() => expect(result.current.isSuccess).toBe(true));

		expect(result.current.data).toEqual(mockStamps);
	});
});

describe('useStampsOptions', () => {
	it('should return stamps as options', async () => {
		const { result } = renderHook(() => useStampsOptions(), { wrapper });

		await waitFor(() => expect(result.current).toHaveLength(2));

		expect(result.current).toEqual([
			{ value: 'stamp1', label: 'stamp1' },
			{ value: 'stamp2', label: 'stamp2' },
		]);
	});
});
