import { useQuery } from "@tanstack/react-query";

import { DDIApi } from "@sdk/index";

import type { CodeListItem } from "./usePhysicalCodeLists";

/** Forme renvoyée par l'endpoint agrégé des listes de codes d'un group (tous LP/CLS). */
interface GroupCodeListResponseItem {
  agency: string;
  id: string;
  label: string;
  versionDate?: string;
}

/**
 * Listes de codes appartenant aux LogicalProduct (via leurs CodeListScheme) d'un group.
 * L'endpoint renvoie `agency`, on le normalise en `agencyId` pour rester homogène
 * avec les autres sources de {@link CodeListItem}.
 */
export const useGroupCodeLists = (agencyId: string, groupId: string) => {
  return useQuery<CodeListItem[]>({
    queryKey: ["groupCodeLists", agencyId, groupId],
    queryFn: async () => {
      const items: GroupCodeListResponseItem[] = await DDIApi.getGroupCodeLists(agencyId, groupId);
      return items.map((item) => ({
        agencyId: item.agency,
        id: item.id,
        label: item.label,
        versionDate: item.versionDate,
      }));
    },
    enabled: !!agencyId && !!groupId,
  });
};
