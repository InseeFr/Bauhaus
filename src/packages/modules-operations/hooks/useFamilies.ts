import { queryOptions, useQuery, useQueryClient } from "@tanstack/react-query";
import { useCallback } from "react";

import { Family, FamilyHome } from "@model/operations/family";

import { OperationsApi } from "@sdk/operations-api";

/**
 * Préfixe commun à la liste (`["families"]`) et aux fiches (`["families", id]`) : l'invalider
 * périme les deux.
 */
const FAMILIES_KEY = ["families"];

export const useFamilies = () =>
  useQuery<FamilyHome[]>({
    queryKey: FAMILIES_KEY,
    queryFn: () => OperationsApi.getAllFamilies(),
  });

/** Fiche d'une famille, partagée entre `useFamily` et les lectures impératives (`fetchQuery`). */
export const familyQuery = (id: string | undefined) =>
  queryOptions<Family>({
    queryKey: [...FAMILIES_KEY, id],
    queryFn: () => OperationsApi.getFamilyById(id),
  });

export const useFamily = (id: string | undefined) =>
  useQuery({ ...familyQuery(id), enabled: !!id });

/**
 * Périme les familles en cache : à appeler après l'enregistrement ou la publication d'une famille. Les requêtes
 * affichées sont relancées, la promesse se résout quand elles ont abouti.
 */
export const useInvalidateFamilies = () => {
  const queryClient = useQueryClient();
  return useCallback(
    () => queryClient.invalidateQueries({ queryKey: FAMILIES_KEY }),
    [queryClient],
  );
};
