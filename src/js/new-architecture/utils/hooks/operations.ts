import { useQuery } from '@tanstack/react-query';
import operationSeries from '../../../remote-api/operations-api';
import { Operation } from '../../model/Operation';

export const useOperations = () => {
	return useQuery({
		queryKey: ['operations'],
		queryFn: () => {
			return operationSeries.getOperationsList() as Promise<Operation[]>;
		},
	});
};
