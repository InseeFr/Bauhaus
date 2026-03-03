import { useMutation, useQueryClient } from "@tanstack/react-query";
import { DDIApi } from "../../sdk";

interface UpdatePhysicalInstanceParams {
  id: string;
  agencyId: string;
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

export function useUpdatePhysicalInstance() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, agencyId, data }: UpdatePhysicalInstanceParams) =>
      DDIApi.patchPhysicalInstance(agencyId, id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["physicalInstances"] });
    },
  });
}
