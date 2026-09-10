import { useQuery } from "@tanstack/react-query";

import { DDIApi } from "@sdk/index";

/**
 * Ligne de recherche avancée : une PhysicalInstance jointe à sa StudyUnit et à son Group
 * parents, libellés déjà résolus côté back. Les champs parents peuvent être `null` pour une
 * PI orpheline (rattachée à aucune StudyUnit résolvable).
 */
export interface PhysicalInstanceSearchRow {
  agency: string;
  id: string;
  label: string | null;
  versionDate: string | null;
  studyUnitAgency: string | null;
  studyUnitId: string | null;
  studyUnitLabel: string | null;
  groupAgency: string | null;
  groupId: string | null;
  groupLabel: string | null;
}

export const usePhysicalInstancesSearch = () => {
  return useQuery<PhysicalInstanceSearchRow[]>({
    queryKey: ["physicalInstancesSearch"],
    queryFn: () => DDIApi.getPhysicalInstancesForAdvancedSearch(),
  });
};
