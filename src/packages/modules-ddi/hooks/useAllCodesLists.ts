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

  // Dégradation gracieuse : on ne remonte une erreur dure que si AUCUNE des deux sources
  // n'est exploitable. L'échec de la liste du groupe (ou de la résolution du groupe parent)
  // ne doit pas masquer les listes mutualisées chargées avec succès, et inversement.
  const groupSideError = parentsQuery.error ?? groupQuery.error;
  const error = groupSideError && mutualizedQuery.error ? mutualizedQuery.error : undefined;

  return {
    data,
    // Libellé du groupe parent de la PI : sert d'en-tête à la section « groupe » du sélecteur.
    // Les listes mutualisées ne sont rattachées à aucun groupe → pas de libellé pour leur section.
    groupLabel: group?.label,
    isLoading,
    error,
  };
};
