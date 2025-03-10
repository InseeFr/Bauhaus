import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { act, renderHook, waitFor } from '@testing-library/react';
import { vi } from 'vitest';

import { ClassificationsApi } from '@sdk/classification';

import {
	useClassification,
	useClassifications,
	usePublishClassification,
} from './hooks';

const createWrapper = () => {
	const queryClient = new QueryClient();
	return ({ children }: { children: React.ReactNode }) => (
		<QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
	);
};

describe('useClassifications', () => {
	vi.spyOn(ClassificationsApi, 'getList').mockResolvedValue([
		{ id: '1', name: 'Classification 1' },
	]);

	it('fetches classifications successfully', async () => {
		const { result } = renderHook(() => useClassifications(), {
			wrapper: createWrapper(),
		});

		expect(result.current.isLoading).toBe(true);
		await waitFor(() => expect(result.current.classifications).toBeDefined());
		expect(result.current.classifications).toEqual([
			{ id: '1', name: 'Classification 1' },
		]);
	});
});

describe('useClassification', () => {
	vi.spyOn(ClassificationsApi, 'getClassificationGeneral').mockResolvedValue({
		id: '1',
		name: 'General Info',
	});
	vi.spyOn(ClassificationsApi, 'getClassificationLevels').mockResolvedValue([
		{ level: 1 },
	]);

	it('fetches classification details', async () => {
		const { result } = renderHook(() => useClassification('1'), {
			wrapper: createWrapper(),
		});

		expect(result.current.isLoading).toBe(true);
		await waitFor(() => expect(result.current.classification).toBeDefined());
		expect(result.current.classification).toEqual({
			general: { id: '1', name: 'General Info' },
			levels: [{ level: 1 }],
		});
	});
});

describe('usePublishClassification', () => {
	vi.spyOn(ClassificationsApi, 'publishClassification').mockResolvedValue({
		success: true,
	});

	it('publishes a classification successfully', async () => {
		const { result } = renderHook(() => usePublishClassification('1'), {
			wrapper: createWrapper(),
		});

		await act(async () => {
			result.current.publish();
		});

		expect(result.current.isPublishing).toBe(false);
	});
});
