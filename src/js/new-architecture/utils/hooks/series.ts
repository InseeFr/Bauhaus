import { useQuery } from '@tanstack/react-query';
import operationSeries from '../../../remote-api/operations-api';
import { Series } from '../../model/Series';

export const useSeries = () => {
	return useQuery({
		queryKey: ['series'],
		queryFn: () => {
			return operationSeries.getSeriesList() as Promise<Series[]>;
		},
	});
};
