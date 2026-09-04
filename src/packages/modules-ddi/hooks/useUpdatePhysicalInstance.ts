import { useMutation, useQueryClient } from "@tanstack/react-query";

import { DDIApi } from "@sdk/index";

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
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["physicalInstances"] });
      // La recherche avancée affiche le label et les parents : elle doit aussi être
      // évincée après un renommage ou un re-rattachement (staleTime: Infinity).
      queryClient.invalidateQueries({ queryKey: ["physicalInstancesSearch"] });
      // Invalider aussi le détail de la PI éditée, sinon le libellé reste
      // périmé quand on revient sur la liste puis qu'on la re-sélectionne.
      queryClient.invalidateQueries({
        queryKey: ["physicalInstanceById", variables.agencyId, variables.id],
      });
    },
  });
}
