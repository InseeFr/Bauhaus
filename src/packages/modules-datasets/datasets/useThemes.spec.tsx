import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { renderHook, waitFor } from '@testing-library/react';
import { PropsWithChildren } from 'react';
import { Mock, vi } from 'vitest';

import { ThemesApi } from '@sdk/index';

import { Theme } from '../../model/theme';
import { useThemes } from './useThemes';

const queryClient = new QueryClient();
const wrapper = ({ children }: PropsWithChildren<unknown>) => (
	<QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
);
vi.mock('../../sdk', () => ({
	ThemesApi: {
		getThemes: vi.fn(),
	},
}));

describe('useThemes Hook', () => {
	afterEach(() => {
		vi.clearAllMocks();
	});

	it('should return formatted themes when the API call is successful', async () => {
		const mockThemes: Theme[] = [
			{ uri: 'theme1', label: 'Theme 1', idConceptScheme: 'Scheme 1' },
			{ uri: 'theme2', label: 'Theme 2', idConceptScheme: 'Scheme 2' },
		];

		(ThemesApi.getThemes as Mock).mockResolvedValue(mockThemes);

		const { result } = renderHook(() => useThemes(), { wrapper });

		await waitFor(() => {
			expect(result.current?.data?.[0].value).toBe('theme1');
			expect(result.current?.data?.[1].value).toBe('theme2');
		});
	});
});
