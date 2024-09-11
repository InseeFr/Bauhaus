import { renderHook } from '@testing-library/react';
import { useStructures } from './structures';
import { vi } from 'vitest';

vi.mock('@tanstack/react-query', () => ({
	useQuery: vi.fn().mockReturnValue({
		isLoading: false,
		data: ['data'],
	}),
}));

describe('useStructures', () => {
	it('should call useQuery', () => {
		const { result } = renderHook(() => useStructures());
		expect(result.current.isLoading).toBe(false);
		expect(result.current.data).toEqual(['data']);
	});
});
