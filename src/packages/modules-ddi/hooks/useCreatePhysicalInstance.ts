import { useMutation, useQueryClient } from "@tanstack/react-query";
import { DDIApi } from "../../sdk";
import { useAppContext } from "../../application/app-context";

interface CreatePhysicalInstanceParams {
  physicalInstanceLabel: string;
  dataRelationshipLabel: string;
  logicalRecordLabel: string;
  groupId: string;
  groupAgency: string;
  studyUnitId: string;
  studyUnitAgency: string;
}

interface TopLevelReference {
  Agency: string | null;
  ID: string;
  Version: string;
  $type: string;
}

interface ApiResponse {
  TopLevelReference: TopLevelReference[];
  PhysicalInstance: Array<{ Agency: string }>;
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
      const response: ApiResponse = await DDIApi.postPhysicalInstance(data);

      const physicalInstanceRef = response.TopLevelReference?.find(
        (ref) => ref.$type === "PhysicalInstance",
      );

      if (!physicalInstanceRef) {
        throw new Error("Physical Instance reference not found in response");
      }

      const agency =
        physicalInstanceRef.Agency || response.PhysicalInstance?.[0]?.Agency || defaultAgencyId;

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
