import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useCallback } from "react";

import { DDIApi } from "@sdk/index";

import type { CategoryUsage } from "../physical-instances/types/api";
import { USAGES_STALE_TIME } from "./useCodeListUsers";

const categoryUsersQueryKey = (agencyId: string, id: string) => ["categoryUsers", agencyId, id];

/**
 * Fetches every CodeList that uses the category {agencyId}/{id}, declaratively.
 *
 * Lazy comme {@link useCodeListUsers} : la marche relationnelle Colectica n'est payée qu'une fois
 * {@code enabled} vrai (ouverture de la popup d'utilisation). Même queryKey que
 * {@link useFetchCategoryUsers} : les deux se partagent le cache.
 */
export const useCategoryUsers = (agencyId: string, id: string, enabled = true) =>
  useQuery<CategoryUsage[]>({
    queryKey: categoryUsersQueryKey(agencyId, id),
    queryFn: () => DDIApi.getCategoryUsers(agencyId, id),
    enabled: enabled && !!agencyId && !!id,
    staleTime: USAGES_STALE_TIME,
  });

/**
 * Fetches every CodeList that uses the category {agencyId}/{id}, imperatively.
 *
 * Contrairement aux autres hooks d'usage (requêtes déclaratives), la récupération est déclenchée
 * au moment précis où l'utilisateur édite une catégorie — d'où une fonction plutôt qu'un
 * {@code useQuery}. Elle passe par le cache TanStack Query ({@link USAGES_STALE_TIME}) pour ne pas
 * payer la marche relationnelle Colectica à chaque édition.
 */
export const useFetchCategoryUsers = () => {
  const queryClient = useQueryClient();
  return useCallback(
    (agencyId: string, id: string) =>
      queryClient.fetchQuery<CategoryUsage[]>({
        queryKey: categoryUsersQueryKey(agencyId, id),
        queryFn: () => DDIApi.getCategoryUsers(agencyId, id),
        staleTime: 60_000,
      }),
    [queryClient],
  );
};
