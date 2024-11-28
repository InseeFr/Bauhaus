import { useQuery } from '@tanstack/react-query';

import { OperationsApi } from '@sdk/operations-api';

import { Series } from '../../model/Series';

export const useSeries = () => {
	return useQuery({
		queryKey: ['series'],
		queryFn: () => {
			return OperationsApi.getSeriesList() as Promise<Series[]>;
		},
	});
};
