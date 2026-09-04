import { useQuery } from "@tanstack/react-query";

import { DDIApi } from "@sdk/index";

import type { LangString } from "../utils/multilingual";

export interface StudyUnit {
  $type: "StudyUnit";
  ID: string;
  Agency: string;
  Version: string;
  Citation: {
    Title: LangString[];
  };
}

export interface Group {
  $type: "Group";
  ID: string;
  Agency: string;
  StudyUnitReference: Array<{
    Agency: string;
    ID: string;
    Version: string;
    TypeOfObject: string;
  }>;
}

/**
 * Enveloppe DDI 4 du groupe : même contrat de fil que la PhysicalInstance
 * (`topLevelReferences` + `items` discriminés par `$type`). Lire les items via `itemsOfType`.
 */
export interface GroupDetailsResponse {
  topLevelReferences?: unknown[];
  items?: Array<Group | StudyUnit>;
}

export function useGroupDetails(agencyId: string | null, groupId: string | null) {
  return useQuery<GroupDetailsResponse>({
    queryKey: ["group", agencyId, groupId],
    queryFn: () => DDIApi.getGroup(agencyId!, groupId!),
    enabled: !!agencyId && !!groupId,
  });
}
