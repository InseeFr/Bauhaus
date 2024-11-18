import { useQuery } from '@tanstack/react-query';

import { OperationsApi } from '@sdk/operations-api';

import { Operation } from '../../model/Operation';

export const useOperations = () => {
	return useQuery({
		queryKey: ['operations'],
		queryFn: () => {
			return OperationsApi.getOperationsList() as Promise<Operation[]>;
		},
	});
};
