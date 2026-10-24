import { useMutation, useQueryClient } from "@tanstack/react-query";

import { DDIApi } from "@sdk/index";

import type { PhysicalInstanceResponse } from "../physical-instances/types/api";

interface ReuseVariablesParams {
  agencyId: string;
  id: string;
  data: {
    physicalInstanceLabel: string;
    dataRelationshipLabel: string;
    logicalRecordLabel: string;
    groupId: string;
    groupAgency: string;
    variableIds: string[];
  };
}

export interface CreatedPhysicalInstance {
  id: string;
  agency: string;
}

/**
 * « Nouveau à partir de… » › « Réutiliser des variables » (#1674) : un fichier neuf dans l'étude
 * de la source, qui partage les variables choisies au lieu de les copier.
 */
export function useReuseVariables() {
  const queryClient = useQueryClient();

  return useMutation({
    meta: { globalErrorToast: false },
    mutationFn: async ({
      agencyId,
      id,
      data,
    }: ReuseVariablesParams): Promise<CreatedPhysicalInstance> => {
      const response: PhysicalInstanceResponse = await DDIApi.reuseVariables(agencyId, id, data);

      const physicalInstanceRef = response.topLevelReferences?.find(
        (ref) => ref.$type === "PhysicalInstance",
      );

      if (!physicalInstanceRef) {
        throw new Error("Physical Instance reference not found in response");
      }

      return { id: physicalInstanceRef.ID, agency: physicalInstanceRef.Agency };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["physicalInstances"] });
      queryClient.invalidateQueries({ queryKey: ["physicalInstancesSearch"] });
      // Les variables réutilisées deviennent partagées avec le nouveau fichier.
      queryClient.invalidateQueries({ queryKey: ["studyUnitVariableUsages"] });
    },
  });
}
