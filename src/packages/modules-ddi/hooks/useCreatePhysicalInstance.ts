import { useMutation, useQueryClient } from "@tanstack/react-query";

import { DDIApi } from "@sdk/index";

import { useAppContext } from "../../application/app-context";
import type { PhysicalInstanceResponse } from "../physical-instances/types/api";
import { singleItemOfType } from "../physical-instances/types/ddi4Items";

interface CreatePhysicalInstanceParams {
  physicalInstanceLabel: string;
  dataRelationshipLabel: string;
  logicalRecordLabel: string;
  groupId: string;
  groupAgency: string;
  studyUnitId: string;
  studyUnitAgency: string;
}

export interface CreatePhysicalInstanceResponse {
  id: string;
  agency: string;
}

export function useCreatePhysicalInstance() {
  const queryClient = useQueryClient();
  const { properties } = useAppContext();
  const defaultAgencyId = properties.defaultAgencyId;

  return useMutation({
    mutationFn: async (
      data: CreatePhysicalInstanceParams,
    ): Promise<CreatePhysicalInstanceResponse> => {
      const response: PhysicalInstanceResponse = await DDIApi.postPhysicalInstance(data);

      const physicalInstanceRef = response.topLevelReferences?.find(
        (ref) => ref.$type === "PhysicalInstance",
      );

      if (!physicalInstanceRef) {
        throw new Error("Physical Instance reference not found in response");
      }

      const agency =
        physicalInstanceRef.Agency ||
        singleItemOfType(response, "PhysicalInstance")?.Agency ||
        defaultAgencyId;

      return {
        id: physicalInstanceRef.ID,
        agency,
      };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["physicalInstances"],
      });
    },
  });
}
