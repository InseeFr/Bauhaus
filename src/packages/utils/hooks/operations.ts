import { useQuery } from '@tanstack/react-query';
import { Operation } from '../../model/Operation';
import { OperationsApi } from '@sdk/operations-api';

export const useOperations = () => {
	return useQuery({
		queryKey: ['operations'],
		queryFn: () => {
			return OperationsApi.getOperationsList() as Promise<Operation[]>;
		},
	});
};
