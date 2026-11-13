import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useCallback } from "react";

import { Operation } from "@model/Operation";

import { OperationsApi } from "@sdk/operations-api";

/**
 * Préfixe commun à la liste (`["operations"]`) et aux fiches (`["operations", id]`) : l'invalider
 * périme les deux.
 */
const OPERATIONS_KEY = ["operations"];

export const useOperations = () => {
  return useQuery({
    queryKey: OPERATIONS_KEY,
    queryFn: () => {
      return OperationsApi.getOperationsList() as Promise<Operation[]>;
    },
  });
};

export const useOperation = (id: string | undefined) =>
  useQuery<Operation>({
    enabled: !!id,
    queryKey: [...OPERATIONS_KEY, id],
    queryFn: () => OperationsApi.getOperation(id),
  });

/**
 * Périme les opérations en cache : à appeler après toute écriture visible sur une fiche
 * (l'opération elle-même, le libellé de sa série, son SIMS). Les requêtes affichées sont relancées,
 * la promesse se résout quand elles ont abouti.
 */
export const useInvalidateOperations = () => {
  const queryClient = useQueryClient();
  return useCallback(
    () => queryClient.invalidateQueries({ queryKey: OPERATIONS_KEY }),
    [queryClient],
  );
};
