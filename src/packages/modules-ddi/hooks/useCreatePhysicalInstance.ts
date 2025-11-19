import { useMutation, useQueryClient } from '@tanstack/react-query';
import { DDIApi } from '../../sdk';

interface CreatePhysicalInstanceParams {
	physicalInstanceLabel: string;
	dataRelationshipName: string;
}

export function useCreatePhysicalInstance() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (data: CreatePhysicalInstanceParams) =>
			DDIApi.postPhysicalInstance(data),
		onSuccess: () => {
			// Invalider le cache pour rafraîchir la liste des physical instances
			queryClient.invalidateQueries({
				queryKey: ['physicalInstances'],
			});
		},
	});
}
