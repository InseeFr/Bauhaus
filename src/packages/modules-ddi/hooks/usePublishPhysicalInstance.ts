import { useMutation, useQueryClient } from "@tanstack/react-query";
import { DDIApi } from "../../sdk";

interface PublishPhysicalInstanceParams {
  id: string;
  agencyId: string;
  data: unknown;
}

export function usePublishPhysicalInstance() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, agencyId, data }: PublishPhysicalInstanceParams) =>
      DDIApi.putPhysicalInstance(agencyId, id, data),
    onSuccess: (_, variables) => {
      // Invalider le cache pour rafraîchir les données
      queryClient.invalidateQueries({
        queryKey: ["physicalInstanceById", variables.agencyId, variables.id],
      });
      // Invalider le cache des code lists pour qu'elles soient disponibles
      // immédiatement dans le sélecteur "Réutiliser une code list"
      queryClient.invalidateQueries({
        queryKey: ["physicalCodesLists", variables.agencyId, variables.id],
      });
    },
  });
}
