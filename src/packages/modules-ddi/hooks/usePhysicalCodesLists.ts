import { useQuery } from "@tanstack/react-query";

import { DDIApi } from "../../sdk";

export interface CodeListItem {
  agencyId: string;
  id: string;
  label: string;
}

export const usePhysicalCodesLists = (agencyId: string, physicalInstanceId: string) => {
  return useQuery<CodeListItem[]>({
    queryKey: ["physicalCodesLists", agencyId, physicalInstanceId],
    queryFn: () => DDIApi.getPhysicalCodesLists(agencyId, physicalInstanceId),
    enabled: !!agencyId && !!physicalInstanceId,
  });
};
