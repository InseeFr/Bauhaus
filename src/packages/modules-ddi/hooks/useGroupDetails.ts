import { useQuery } from "@tanstack/react-query";
import { DDIApi } from "../../sdk";
import type { MultilingualStringEntry } from "../utils/multilingual";

export interface StudyUnit {
  ID: string;
  Agency: string;
  Version: string;
  Citation: {
    Title: {
      String: MultilingualStringEntry[];
    };
  };
}

interface GroupDetailsResponse {
  Group: Array<{
    ID: string;
    Agency: string;
    StudyUnitReference: Array<{
      Agency: string;
      ID: string;
      Version: string;
      TypeOfObject: string;
    }>;
  }>;
  StudyUnit: StudyUnit[];
}

export function useGroupDetails(agencyId: string | null, groupId: string | null) {
  return useQuery<GroupDetailsResponse>({
    queryKey: ["group", agencyId, groupId],
    queryFn: () => DDIApi.getGroup(agencyId!, groupId!),
    enabled: !!agencyId && !!groupId,
  });
}
