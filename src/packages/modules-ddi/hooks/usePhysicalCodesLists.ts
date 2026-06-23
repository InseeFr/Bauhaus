import { useQuery } from "@tanstack/react-query";

import { DDIApi } from "../../sdk";

export interface CodeListItem {
  agencyId: string;
  id: string;
  label: string;
  /** Nom technique (itemName) renvoyé uniquement pour les listes mutualisées : sert à la recherche. */
  name?: string;
  mutualized?: boolean;
}

export const usePhysicalCodesLists = (agencyId: string, physicalInstanceId: string) => {
  return useQuery<CodeListItem[]>({
    queryKey: ["physicalCodesLists", agencyId, physicalInstanceId],
    queryFn: () => DDIApi.getPhysicalCodesLists(agencyId, physicalInstanceId),
    enabled: !!agencyId && !!physicalInstanceId,
  });
};
