import { renderHook } from '@testing-library/react';
import { vi } from 'vitest';

import { useCollections } from './collections';

vi.mock('@tanstack/react-query', () => ({
	useQuery: vi.fn().mockReturnValue({
		isLoading: true,
		data: ['data'],
	}),
	useMutation: vi.fn(),
}));

describe('useCollections', () => {
	it('should call useQuery', () => {
		const { result } = renderHook(() => useCollections());

		expect(result.current.isLoading).toBe(true);
		expect(result.current.data).toEqual(['data']);
	});
});
