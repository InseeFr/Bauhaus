import { useQuery } from "@tanstack/react-query";

import { DDIApi } from "@sdk/index";

export interface CodeListItem {
  agencyId: string;
  id: string;
  label: string;
  /** Nom technique (itemName) renvoyé uniquement pour les listes mutualisées : sert à la recherche. */
  name?: string;
  /** Date de version (ISO), renvoyée pour les listes mutualisées : affichée entre parenthèses dans le sélecteur. */
  versionDate?: string;
  mutualized?: boolean;
}

export const usePhysicalCodeLists = (agencyId: string, physicalInstanceId: string) => {
  return useQuery<CodeListItem[]>({
    queryKey: ["physicalCodeLists", agencyId, physicalInstanceId],
    queryFn: () => DDIApi.getPhysicalCodeLists(agencyId, physicalInstanceId),
    enabled: !!agencyId && !!physicalInstanceId,
  });
};
