import { useQuery } from '@tanstack/react-query';
import { Series } from '../../model/Series';
import { OperationsApi } from '@sdk/operations-api';

export const useSeries = () => {
	return useQuery({
		queryKey: ['series'],
		queryFn: () => {
			return OperationsApi.getSeriesList() as Promise<Series[]>;
		},
	});
};
