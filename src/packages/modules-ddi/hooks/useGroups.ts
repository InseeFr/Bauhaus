import { useQuery } from "@tanstack/react-query";
import { DDIApi } from "../../sdk";

export interface Group {
  id: string;
  label: string;
  versionDate: string;
  agency: string;
}

export function useGroups() {
  return useQuery<Group[]>({
    queryKey: ["groups"],
    queryFn: () => DDIApi.getGroups(),
  });
}
