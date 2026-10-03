import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useCallback } from "react";

import { FamilyHome } from "@model/operations/family";

import { OperationsApi } from "@sdk/operations-api";

const FAMILIES_KEY = ["families"];

export const useFamilies = () =>
  useQuery<FamilyHome[]>({
    queryKey: FAMILIES_KEY,
    queryFn: () => OperationsApi.getAllFamilies(),
  });

/**
 * Périme les familles en cache : à appeler après l'enregistrement d'une famille. Les requêtes
 * affichées sont relancées, la promesse se résout quand elles ont abouti.
 */
export const useInvalidateFamilies = () => {
  const queryClient = useQueryClient();
  return useCallback(
    () => queryClient.invalidateQueries({ queryKey: FAMILIES_KEY }),
    [queryClient],
  );
};
