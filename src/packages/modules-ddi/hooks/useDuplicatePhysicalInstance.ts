import { useMutation, useQueryClient } from "@tanstack/react-query";

import { DDIApi } from "@sdk/index";

import type { PhysicalInstanceResponse } from "../physical-instances/types/api";

interface DuplicatePhysicalInstanceParams {
  agencyId: string;
  id: string;
  data: {
    physicalInstanceLabel: string;
    dataRelationshipLabel: string;
    logicalRecordLabel: string;
    groupId: string;
    groupAgency: string;
    studyUnitId: string;
    studyUnitAgency: string;
  };
}

export interface DuplicatedPhysicalInstance {
  id: string;
  agency: string;
}

export function useDuplicatePhysicalInstance() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      agencyId,
      id,
      data,
    }: DuplicatePhysicalInstanceParams): Promise<DuplicatedPhysicalInstance> => {
      const response: PhysicalInstanceResponse = await DDIApi.duplicatePhysicalInstance(
        agencyId,
        id,
        data,
      );

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
    },
  });
}
