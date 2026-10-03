import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useCallback } from "react";

import { Indicator, IndicatorsList } from "@model/operations/indicator";

import { OperationsApi } from "@sdk/operations-api";

/**
 * Préfixe commun à la liste (`["indicators"]`) et aux fiches (`["indicators", id]`) : l'invalider
 * périme les deux.
 */
const INDICATORS_KEY = ["indicators"];

export const useIndicators = () =>
  useQuery<IndicatorsList>({
    queryKey: INDICATORS_KEY,
    queryFn: () => OperationsApi.getAllIndicators(),
  });

export const useIndicator = (id: string | undefined) =>
  useQuery<Indicator>({
    enabled: !!id,
    queryKey: [...INDICATORS_KEY, id],
    queryFn: () => OperationsApi.getIndicatorById(id),
  });

/**
 * Périme les indicateurs en cache : à appeler après toute écriture visible sur une fiche
 * (l'indicateur lui-même, le libellé d'une série qui le produit, son SIMS). Les requêtes affichées
 * sont relancées, la promesse se résout quand elles ont abouti.
 */
export const useInvalidateIndicators = () => {
  const queryClient = useQueryClient();
  return useCallback(
    () => queryClient.invalidateQueries({ queryKey: INDICATORS_KEY }),
    [queryClient],
  );
};
