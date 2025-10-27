import { useMutation, useQueryClient } from '@tanstack/react-query';
import { DDIApi } from '../../sdk';

interface UpdatePhysicalInstanceParams {
	id: string;
	data: {
		physicalInstanceLabel: string;
		dataRelationshipName: string;
	};
}

export function useUpdatePhysicalInstance() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: ({ id, data }: UpdatePhysicalInstanceParams) =>
			DDIApi.patchPhysicalInstance(id, data),
		onSuccess: (_, variables) => {
			// Invalider le cache pour rafraîchir les données
			queryClient.invalidateQueries({
				queryKey: ['physicalInstanceById', variables.id],
			});
		},
	});
}
