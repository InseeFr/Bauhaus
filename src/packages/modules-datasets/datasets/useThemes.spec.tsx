import { act, renderHook, waitFor } from '@testing-library/react';
import { useQuery } from '@tanstack/react-query';
import { useThemes } from './useThemes';
import { ThemesApi } from '../../sdk';
import { Theme } from '../../model/Theme';

jest.mock('@tanstack/react-query', () => ({
	useQuery: jest.fn(),
}));

jest.mock('../../sdk', () => ({
	ThemesApi: {
		getThemes: jest.fn(),
	},
}));

describe('useThemes Hook', () => {
	afterEach(() => {
		jest.clearAllMocks();
	});

	it('should return formatted themes when the API call is successful', async () => {
		const mockThemes: Theme[] = [
			{ uri: 'theme1', label: 'Theme 1', idConceptScheme: 'Scheme 1' },
			{ uri: 'theme2', label: 'Theme 2', idConceptScheme: 'Scheme 2' },
		];

		(ThemesApi.getThemes as jest.Mock).mockResolvedValue(mockThemes);

		const { result, rerender } = renderHook(() => useThemes());

		expect(useQuery).toHaveBeenCalledWith({
			queryKey: ['themes'],
			queryFn: expect.any(Function),
		});

		waitFor(() => {
			expect(result.current?.data).toEqual([
				{
					value: 'theme1',
					label: (
						<>
							Theme 1 <i>(Scheme 1)</i>
						</>
					),
				},
				{
					value: 'theme2',
					label: (
						<>
							Theme 2 <i>(Scheme 2)</i>
						</>
					),
				},
			]);
		});
	});

	it('should handle API call failure', async () => {
		const mockError = new Error('Failed to fetch themes');

		(ThemesApi.getThemes as jest.Mock).mockRejectedValue(mockError);

		const { result } = renderHook(() => useThemes());

		waitFor(() => {
			expect(result.current?.error).toBe(mockError);
		});
	});
});
