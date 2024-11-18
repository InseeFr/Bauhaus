import { renderHook } from '@testing-library/react';
import { vi } from 'vitest';

import { useStructures } from './structures';

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
