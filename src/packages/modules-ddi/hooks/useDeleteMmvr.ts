import { useMutation, useQueryClient } from "@tanstack/react-query";

import { DDIApi } from "../../sdk";

/**
 * Suppression d'une ManagedMissingValuesRepresentation orpheline (valeurs sentinelles, #1566) :
 * le back refuse (409) si une variable la référence encore. Invalide les caches sentinelles pour
 * que le sélecteur et les usages reflètent la suppression.
 */
export const useDeleteMmvr = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ agencyId, id }: { agencyId: string; id: string }) =>
      DDIApi.deleteMissingValuesRepresentation(agencyId, id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["groupMissingValuesRepresentations"] });
      queryClient.invalidateQueries({ queryKey: ["mmvrUsers"] });
    },
  });
};
