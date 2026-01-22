import { useMemo } from "react";
import { usePhysicalCodesLists, type CodeListItem } from "./usePhysicalCodesLists";
import { useMutualizedCodesLists } from "./useMutualizedCodesLists";

export const useAllCodesLists = (agencyId: string, physicalInstanceId: string) => {
  const physicalQuery = usePhysicalCodesLists(agencyId, physicalInstanceId);
  const mutualizedQuery = useMutualizedCodesLists();

  const data = useMemo(() => {
    const physicalLists = physicalQuery.data ?? [];
    const mutualizedLists = mutualizedQuery.data ?? [];

    const uniqueMap = new Map<string, CodeListItem>();

    for (const item of physicalLists) {
      uniqueMap.set(`${item.agencyId}-${item.id}`, item);
    }

    for (const item of mutualizedLists) {
      const key = `${item.agencyId}-${item.id}`;
      if (!uniqueMap.has(key)) {
        uniqueMap.set(key, item);
      }
    }

    return Array.from(uniqueMap.values());
  }, [physicalQuery.data, mutualizedQuery.data]);

  const isLoading = physicalQuery.isLoading || mutualizedQuery.isLoading;
  const error = physicalQuery.error || mutualizedQuery.error;

  return {
    data,
    isLoading,
    error,
  };
};
