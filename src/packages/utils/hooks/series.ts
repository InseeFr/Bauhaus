import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useCallback } from "react";

import { Series } from "@model/Series";

import { OperationsApi } from "@sdk/operations-api";

/**
 * Préfixe commun à la liste (`["series"]`), à la recherche avancée
 * (`["series", "advanced-search"]`) et aux fiches (`["series", id]`) : l'invalider périme les trois.
 */
const SERIES_KEY = ["series"];

export const useSeries = () => {
  return useQuery({
    queryKey: SERIES_KEY,
    queryFn: () => {
      return OperationsApi.getSeriesList() as Promise<Series[]>;
    },
  });
};

export const useSerie = <T>(id: string | undefined) =>
  useQuery<T>({
    enabled: !!id,
    queryKey: [...SERIES_KEY, id],
    queryFn: () => OperationsApi.getSerie(id),
  });

export const useSeriesSearchList = <T>() =>
  useQuery<T[]>({
    queryKey: [...SERIES_KEY, "advanced-search"],
    queryFn: () => OperationsApi.getSeriesSearchList(),
  });

/**
 * Périme les séries en cache : à appeler après toute écriture visible sur une fiche ou dans les
 * listes (la série elle-même, ses opérations, sa famille, les indicateurs qu'elle produit, son
 * SIMS). Les requêtes affichées sont relancées, la promesse se résout quand elles ont abouti.
 */
export const useInvalidateSeries = () => {
  const queryClient = useQueryClient();
  return useCallback(() => queryClient.invalidateQueries({ queryKey: SERIES_KEY }), [queryClient]);
};
