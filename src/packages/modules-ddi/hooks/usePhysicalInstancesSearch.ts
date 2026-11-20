import { useQuery } from "@tanstack/react-query";

import { DDIApi } from "@sdk/ddi-api";

/**
 * Ligne de recherche avancée : une PhysicalInstance jointe à sa StudyUnit et à son Group
 * parents, libellés déjà résolus côté back. Les champs parents peuvent être `null` pour une
 * PI orpheline (rattachée à aucune StudyUnit résolvable). Les titres alternatifs (sigles) de la
 * StudyUnit et du Group permettent de les retrouver dans les sélecteurs de la recherche.
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
  studyUnitAlternateTitles: string[];
  groupAlternateTitles: string[];
}

export const usePhysicalInstancesSearch = () => {
  return useQuery<PhysicalInstanceSearchRow[]>({
    queryKey: ["physicalInstancesSearch"],
    queryFn: () => DDIApi.getPhysicalInstancesForAdvancedSearch(),
  });
};
