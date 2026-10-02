import { useQuery } from "@tanstack/react-query";

import { DDIApi } from "@sdk/index";

export interface Group {
  id: string;
  label: string;
  versionDate: string;
  agency: string;
}

export function useGroups({ enabled = true }: { enabled?: boolean } = {}) {
  return useQuery<Group[]>({
    queryKey: ["groups"],
    queryFn: () => DDIApi.getGroups(),
    enabled,
  });
}
