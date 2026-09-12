import { useGroupMissingValuesRepresentations } from "./useGroupMissingValuesRepresentations";
import { usePhysicalInstanceParents } from "./usePhysicalInstanceParents";

/**
 * MMVR réutilisables du groupe parent d'une PhysicalInstance (valeurs sentinelles, #1566) :
 * résout d'abord le groupe parent (comme {@link useAllCodeLists}), puis liste ses MMVR.
 */
export const useAllMissingValuesRepresentations = (
  agencyId: string,
  physicalInstanceId: string,
) => {
  const parentsQuery = usePhysicalInstanceParents(agencyId, physicalInstanceId);
  const group = parentsQuery.data?.group;

  const mmvrQuery = useGroupMissingValuesRepresentations(group?.agency ?? "", group?.id ?? "");

  return {
    data: mmvrQuery.data ?? [],
    groupLabel: group?.label,
    isLoading: parentsQuery.isLoading || mmvrQuery.isLoading,
    error: parentsQuery.error ?? mmvrQuery.error ?? undefined,
  };
};
