import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useSeries } from './series';
import operationSeries from '../../../remote-api/operations-api';
import { Series } from '../../model/Series';

jest.mock('../../../remote-api/operations-api');

const queryClient = new QueryClient();

const wrapper = ({ children }: any) => (
	<QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
);

describe('useSeries', () => {
	it('fetches and returns series data', async () => {
		const seriesMock: Series[] = [
			{ id: '1', label: 'Series 1', iri: 'iri', altLabel: 'altLabel 1' },
		];

		(operationSeries.getSeriesList as any).mockResolvedValueOnce(seriesMock);

		const { result } = renderHook(() => useSeries(), { wrapper });

		await waitFor(() => expect(result.current.isSuccess).toBe(true));

		expect(result.current.data).toEqual(seriesMock);
		expect(operationSeries.getSeriesList).toHaveBeenCalledTimes(1);
	});
});
