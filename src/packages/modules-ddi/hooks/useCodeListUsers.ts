import { useCallback } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";

import { DDIApi } from "../../sdk";
import type { CodeListUsage } from "../physical-instances/types/api";

const codeListUsersQueryKey = (agencyId: string, id: string) => ["codeListUsers", agencyId, id];

/**
 * Politique de fraîcheur des requêtes d'usages (liste de codes comme catégorie) : jamais périmées
 * d'elles-mêmes, évincées explicitement par {@code usePublishPhysicalInstance} — seule une
 * sauvegarde peut changer qui utilise quoi. Reprend la valeur par défaut de l'application, mais de
 * façon explicite : la garde d'édition rappelle ces requêtes à chaque modification, et un
 * {@code staleTime} court y paierait la marche relationnelle Colectica à répétition.
 */
export const USAGES_STALE_TIME = Infinity;

/**
 * Fetches every Variable / PhysicalInstance / StudyUnit that uses the code list {agencyId}/{id}.
 *
 * The query is lazy: it only runs once {@code enabled} is true (e.g. when the user opens the
 * "who uses this list" panel), so the relationship walk on Colectica is not paid up-front.
 */
export const useCodeListUsers = (agencyId: string, id: string, enabled = true) => {
  return useQuery<CodeListUsage[]>({
    queryKey: codeListUsersQueryKey(agencyId, id),
    queryFn: () => DDIApi.getCodeListUsers(agencyId, id),
    enabled: enabled && !!agencyId && !!id,
    staleTime: USAGES_STALE_TIME,
  });
};

/**
 * Récupération impérative des usages d'une liste de codes, au moment précis où une édition doit
 * être gardée. Même queryKey que {@link useCodeListUsers} : servie par le cache quand la requête
 * déclarative a déjà répondu, sinon déclenche le fetch et attend le résultat — la garde ne doit
 * jamais décider sur des usages simplement « pas encore chargés ».
 */
export const useFetchCodeListUsers = () => {
  const queryClient = useQueryClient();
  return useCallback(
    (agencyId: string, id: string) =>
      queryClient.fetchQuery<CodeListUsage[]>({
        queryKey: codeListUsersQueryKey(agencyId, id),
        queryFn: () => DDIApi.getCodeListUsers(agencyId, id),
        staleTime: USAGES_STALE_TIME,
      }),
    [queryClient],
  );
};
