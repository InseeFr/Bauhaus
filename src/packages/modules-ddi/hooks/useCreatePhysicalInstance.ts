import { useMutation, useQueryClient } from "@tanstack/react-query";
import { DDIApi } from "../../sdk";

interface CreatePhysicalInstanceParams {
  physicalInstanceLabel: string;
  dataRelationshipName: string;
}

interface TopLevelReference {
  Agency: string | null;
  ID: string;
  Version: string;
  TypeOfObject: string;
}

interface ApiResponse {
  topLevelReference: TopLevelReference[];
  PhysicalInstance: Array<{ Agency: string }>;
}

export interface CreatePhysicalInstanceResponse {
  id: string;
  agency: string;
}

export function useCreatePhysicalInstance() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreatePhysicalInstanceParams): Promise<CreatePhysicalInstanceResponse> => {
      const response: ApiResponse = await DDIApi.postPhysicalInstance(data);

      const physicalInstanceRef = response.topLevelReference?.find(
        (ref) => ref.TypeOfObject === "PhysicalInstance",
      );

      if (!physicalInstanceRef) {
        throw new Error("Physical Instance reference not found in response");
      }

      const agency =
        physicalInstanceRef.Agency || response.PhysicalInstance?.[0]?.Agency || "fr.insee";

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
