import { useMutation, useQueryClient } from "@tanstack/react-query";

import { DDIApi } from "@sdk/ddi-api";

import type { PhysicalInstanceResponse } from "../physical-instances/types/api";

/** Une variable de la source : copiée, ou remplacée par sa dérivée de l'étude cible. */
export interface RolloverVariable {
  sourceId: string;
  reusedAgency?: string;
  reusedId?: string;
}

interface RolloverParams {
  agencyId: string;
  id: string;
  data: {
    physicalInstanceLabel: string;
    dataRelationshipLabel: string;
    logicalRecordLabel: string;
    studyUnitId: string;
    studyUnitAgency: string;
    groupId: string;
    groupAgency: string;
    variables: RolloverVariable[];
  };
}

export interface CreatedPhysicalInstance {
  id: string;
  agency: string;
}

/**
 * « Nouveau à partir de… » › « Nouvelle période » (#1672) : un fichier neuf dans une autre étude
 * du groupe de la source, dont les variables sont copiées (avec `BasedOn`) ou réutilisées quand
 * l'étude cible en a déjà une dérivée.
 */
export function useRollover() {
  const queryClient = useQueryClient();

  return useMutation({
    meta: { globalErrorToast: false },
    mutationFn: async ({
      agencyId,
      id,
      data,
    }: RolloverParams): Promise<CreatedPhysicalInstance> => {
      const response: PhysicalInstanceResponse = await DDIApi.rollover(agencyId, id, data);

      const physicalInstanceRef = response.topLevelReferences?.find(
        (ref) => ref.$type === "PhysicalInstance",
      );

      if (!physicalInstanceRef) {
        throw new Error("Physical Instance reference not found in response");
      }

      return { id: physicalInstanceRef.ID, agency: physicalInstanceRef.Agency };
    },
    onSuccess: (_created, { data }) => {
      queryClient.invalidateQueries({ queryKey: ["physicalInstances"] });
      queryClient.invalidateQueries({ queryKey: ["physicalInstancesSearch"] });
      // Les copies rejoignent le VariableScheme de l'étude cible, qui gagne un fichier.
      queryClient.invalidateQueries({
        queryKey: ["studyUnitVariables", data.studyUnitAgency, data.studyUnitId],
      });
      queryClient.invalidateQueries({
        queryKey: ["studyUnitVariableUsages", data.studyUnitAgency, data.studyUnitId],
      });
    },
  });
}
