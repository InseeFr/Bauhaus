import { useClassifications } from './classifications';
import { renderHook } from '@testing-library/react';

jest.mock('@tanstack/react-query', () => ({
	useQuery: jest.fn(),
}));

describe('useClassifications', () => {
	fit('should call useQuery', () => {
		require('@tanstack/react-query').useQuery.mockReturnValue({
			isLoading: true,
			data: ['data'],
		});

		const { result } = renderHook(() => useClassifications());

		expect(result.current.isLoading).toBe(true);
		expect(result.current.data).toEqual(['data']);
	});
});
