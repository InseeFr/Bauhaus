import { useQuery } from "@tanstack/react-query";

import { DDIApi } from "../../sdk";

/**
 * Ligne de la liste des PhysicalInstance (`GET /ddi/physical-instance`), telle que sérialisée
 * par PartialPhysicalInstanceResponse côté back.
 */
export interface PartialPhysicalInstance {
  id: string;
  label: string | null;
  versionDate: string | null;
  agency: string;
}

export const usePhysicalInstances = () => {
  return useQuery<PartialPhysicalInstance[]>({
    queryKey: ["physicalInstances"],
    queryFn: () => DDIApi.getPhysicalInstances(),
  });
};
