import { useQuery } from "@tanstack/react-query";

import { DDIApi } from "../../sdk";
import type { CodeListUsage } from "../physical-instances/types/api";

/**
 * Fetches every Variable / PhysicalInstance / StudyUnit that uses the code list {agencyId}/{id}.
 *
 * The query is lazy: it only runs once {@code enabled} is true (e.g. when the user opens the
 * "who uses this list" panel), so the relationship walk on Colectica is not paid up-front.
 */
export const useCodeListUsers = (agencyId: string, id: string, enabled = true) => {
  return useQuery<CodeListUsage[]>({
    queryKey: ["codeListUsers", agencyId, id],
    queryFn: () => DDIApi.getCodeListUsers(agencyId, id),
    enabled: enabled && !!agencyId && !!id,
  });
};
