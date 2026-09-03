import { useQuery } from "@tanstack/react-query";

import { DDIApi } from "../../sdk";
import type { CodeListUsage } from "../physical-instances/types/api";

/**
 * Variables (avec PhysicalInstance et StudyUnit) qui référencent la
 * ManagedMissingValuesRepresentation {agencyId}/{id} (valeurs sentinelles, #1566).
 * Alimente la règle lecture seule/écriture : la CodeList d'une MMVR n'est éditable que si la
 * variable ouverte est sa seule utilisatrice.
 */
export const useMmvrUsers = (agencyId: string, id: string, enabled = true) => {
  return useQuery<CodeListUsage[]>({
    queryKey: ["mmvrUsers", agencyId, id],
    queryFn: () => DDIApi.getMissingValuesRepresentationUsers(agencyId, id),
    enabled: enabled && !!agencyId && !!id,
  });
};
