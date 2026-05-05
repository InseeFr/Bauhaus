import { useQuery } from "@tanstack/react-query";
import { DDIApi } from "../../sdk";

export interface PhysicalInstanceParents {
  studyUnit: { agency: string; id: string };
  group: { agency: string; id: string };
}

export function usePhysicalInstanceParents(agencyId: string, id: string) {
  return useQuery<PhysicalInstanceParents>({
    queryKey: ["physicalInstanceParents", agencyId, id],
    queryFn: () => DDIApi.getPhysicalInstanceParents(agencyId, id),
  });
}
