import { renderHook } from '@testing-library/react';
import { useStructures } from './structures';

jest.mock('@tanstack/react-query', () => ({
	useQuery: jest.fn(),
}));

describe('useStructures', () => {
	it('should call useQuery', () => {
		require('@tanstack/react-query').useQuery.mockReturnValue({
			isLoading: true,
			data: ['data'],
		});

		const { result } = renderHook(() => useStructures());

		expect(result.current.isLoading).toBe(true);
		expect(result.current.data).toEqual(['data']);
	});
});
