import { useMutation, useQueryClient } from '@tanstack/react-query';
import { DDIApi } from '../../sdk';

interface UpdatePhysicalInstanceParams {
	id: string;
	agencyId: string;
	data: {
		physicalInstanceLabel: string;
		dataRelationshipName: string;
	};
}

export function useUpdatePhysicalInstance() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: ({ id, agencyId, data }: UpdatePhysicalInstanceParams) =>
			DDIApi.patchPhysicalInstance(agencyId, id, data),
		onSuccess: (_, variables) => {
			// Invalider le cache pour rafraîchir les données
			queryClient.invalidateQueries({
				queryKey: ['physicalInstanceById', variables.agencyId, variables.id],
			});
		},
	});
}
