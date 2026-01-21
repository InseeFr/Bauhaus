import { useMutation } from "@tanstack/react-query";
import { DDIApi } from "../../sdk";

interface UpdatePhysicalInstanceParams {
  id: string;
  agencyId: string;
  data: {
    physicalInstanceLabel: string;
    dataRelationshipName: string;
    groupId: string;
    groupAgency: string;
    studyUnitId: string;
    studyUnitAgency: string;
  };
}

export function useUpdatePhysicalInstance() {
  return useMutation({
    mutationFn: ({ id, agencyId, data }: UpdatePhysicalInstanceParams) =>
      DDIApi.patchPhysicalInstance(agencyId, id, data),
    // Ne pas invalider le cache ici car cela écraserait les variables locales
    // non sauvegardées. Le titre est mis à jour localement via le state du composant.
  });
}
