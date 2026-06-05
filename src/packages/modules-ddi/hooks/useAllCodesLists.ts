import { useMemo } from "react";
import { type CodeListItem } from "./usePhysicalCodesLists";
import { useGroupCodesLists } from "./useGroupCodesLists";
import { useMutualizedCodesLists } from "./useMutualizedCodesLists";
import { usePhysicalInstanceParents } from "./usePhysicalInstanceParents";

export const useAllCodesLists = (agencyId: string, physicalInstanceId: string) => {
  const parentsQuery = usePhysicalInstanceParents(agencyId, physicalInstanceId);
  const group = parentsQuery.data?.group;

  const groupQuery = useGroupCodesLists(group?.agency ?? "", group?.id ?? "");
  const mutualizedQuery = useMutualizedCodesLists();

  const data = useMemo(() => {
    const groupLists = groupQuery.data ?? [];
    const mutualizedLists = mutualizedQuery.data ?? [];

    const uniqueMap = new Map<string, CodeListItem>();

    // Listes du LogicalProduct du group : éditables.
    for (const item of groupLists) {
      uniqueMap.set(`${item.agencyId}-${item.id}`, { ...item, mutualized: false });
    }

    // Listes mutualisées : read-only, prioritaires en cas de doublon.
    for (const item of mutualizedLists) {
      uniqueMap.set(`${item.agencyId}-${item.id}`, { ...item, mutualized: true });
    }

    return Array.from(uniqueMap.values());
  }, [groupQuery.data, mutualizedQuery.data]);

  const isLoading = parentsQuery.isLoading || groupQuery.isLoading || mutualizedQuery.isLoading;
  const error = parentsQuery.error || groupQuery.error || mutualizedQuery.error;

  return {
    data,
    isLoading,
    error,
  };
};
