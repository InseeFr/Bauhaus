import { renderHook, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { usePhysicalInstancesData } from './usePhysicalInstance';
import type { ReactNode } from 'react';

// Mock fetch globally
global.fetch = vi.fn();

vi.mock('react-i18next', () => ({
	useTranslation: () => ({
		i18n: {
			language: 'fr-FR',
		},
	}),
}));

const mockApiResponse = {
	Variable: [
		{
			ID: '1',
			'@versionDate': '2024-06-03T14:29:23.4049817Z',
			VariableName: {
				String: {
					'@xml:lang': 'fr-FR',
					'#text': 'ACTOCCUPE',
				},
			},
			Label: {
				Content: {
					'@xml:lang': 'fr-FR',
					'#text': 'Actif occupé',
				},
			},
			VariableRepresentation: {
				CodeRepresentation: {
					'@blankIsMissingValue': 'false',
					CodeListReference: {
						Agency: 'fr.insee',
						ID: '2a22ba00-a977-4a61-a582-99025c6b0582',
						Version: '1',
						TypeOfObject: 'CodeList',
					},
				},
			},
		},
		{
			ID: '2',
			'@versionDate': '2024-06-03T13:35:37.9342777Z',
			VariableName: {
				String: {
					'@xml:lang': 'fr-FR',
					'#text': 'AG',
				},
			},
			Label: {
				Content: {
					'@xml:lang': 'fr-FR',
					'#text': 'Age',
				},
			},
			VariableRepresentation: {
				NumericRepresentation: {
					NumberRange: {
						Low: { '@isInclusive': 'false', '#text': '0' },
						High: { '@isInclusive': 'false', '#text': '100' },
					},
					NumericTypeCode: 'Integer',
				},
			},
		},
		{
			ID: '3',
			'@versionDate': '2024-06-03T13:35:37.9342777Z',
			VariableName: {
				String: {
					'@xml:lang': 'fr-FR',
					'#text': 'UNKNOWN_VAR',
				},
			},
			Label: {
				Content: {
					'@xml:lang': 'fr-FR',
					'#text': 'Unknown Variable',
				},
			},
			VariableRepresentation: {},
		},
	],
};

describe('usePhysicalInstancesData', () => {
	let queryClient: QueryClient;

	const wrapper = ({ children }: { children: ReactNode }) => (
		<QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
	);

	beforeEach(() => {
		queryClient = new QueryClient({
			defaultOptions: {
				queries: {
					retry: false,
				},
			},
		});
		vi.clearAllMocks();
	});

	it('should fetch and transform data successfully', async () => {
		(global.fetch as any).mockResolvedValueOnce({
			ok: true,
			json: async () => mockApiResponse,
		});

		const { result } = renderHook(() => usePhysicalInstancesData('test-id'), {
			wrapper,
		});

		await waitFor(() => expect(result.current.isSuccess).toBe(true));

		expect(result.current.variables).toHaveLength(3);
		expect(result.current.variables[0]).toEqual({
			id: '1',
			name: 'ACTOCCUPE',
			label: 'Actif occupé',
			type: 'code',
			lastModified: expect.stringContaining('2024'),
		});
		expect(result.current.variables[1]).toEqual({
			id: '2',
			name: 'AG',
			label: 'Age',
			type: 'numeric',
			lastModified: expect.stringContaining('2024'),
		});
		expect(result.current.variables[2]).toEqual({
			id: '3',
			name: 'UNKNOWN_VAR',
			label: 'Unknown Variable',
			type: 'text',
			lastModified: expect.stringContaining('2024'),
		});
	});

	it('should handle empty variables array', async () => {
		(global.fetch as any).mockResolvedValueOnce({
			ok: true,
			json: async () => ({ Variable: [] }),
		});

		const { result } = renderHook(() => usePhysicalInstancesData('test-id'), {
			wrapper,
		});

		await waitFor(() => expect(result.current.isSuccess).toBe(true));

		expect(result.current.variables).toEqual([]);
	});

	it('should handle missing Variable property', async () => {
		(global.fetch as any).mockResolvedValueOnce({
			ok: true,
			json: async () => ({}),
		});

		const { result } = renderHook(() => usePhysicalInstancesData('test-id'), {
			wrapper,
		});

		await waitFor(() => expect(result.current.isSuccess).toBe(true));

		expect(result.current.variables).toEqual([]);
	});

	it('should handle fetch error', async () => {
		(global.fetch as any).mockResolvedValueOnce({
			ok: false,
		});

		const { result } = renderHook(() => usePhysicalInstancesData('test-id'), {
			wrapper,
		});

		await waitFor(() => expect(result.current.isError).toBe(true));

		expect(result.current.error).toBeDefined();
	});

	it('should handle network error', async () => {
		(global.fetch as any).mockRejectedValueOnce(new Error('Network error'));

		const { result } = renderHook(() => usePhysicalInstancesData('test-id'), {
			wrapper,
		});

		await waitFor(() => expect(result.current.isError).toBe(true));

		expect(result.current.error).toBeDefined();
	});

	it('should return isLoading state initially', () => {
		(global.fetch as any).mockImplementationOnce(
			() =>
				new Promise((resolve) => {
					setTimeout(
						() =>
							resolve({
								ok: true,
								json: async () => mockApiResponse,
							}),
						100,
					);
				}),
		);

		const { result } = renderHook(() => usePhysicalInstancesData('test-id'), {
			wrapper,
		});

		expect(result.current.isLoading).toBe(true);
	});

	it('should format dates according to locale', async () => {
		(global.fetch as any).mockResolvedValueOnce({
			ok: true,
			json: async () => mockApiResponse,
		});

		const { result } = renderHook(() => usePhysicalInstancesData('test-id'), {
			wrapper,
		});

		await waitFor(() => expect(result.current.isSuccess).toBe(true));

		// Check that the date is formatted (contains slashes or locale-specific formatting)
		expect(result.current.variables[0].lastModified).toMatch(
			/\d{2}\/\d{2}\/\d{4}/,
		);
	});
});
