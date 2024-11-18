import { renderHook } from '@testing-library/react';
import { vi } from 'vitest';

import { useClassifications } from './classifications';

vi.mock('@tanstack/react-query', () => ({
	useQuery: vi.fn().mockReturnValue({
		isLoading: true,
		data: ['data'],
	}),
}));

describe('useClassifications', () => {
	it('should call useQuery', () => {
		const { result } = renderHook(() => useClassifications());

		expect(result.current.isLoading).toBe(true);
		expect(result.current.data).toEqual(['data']);
	});
});
