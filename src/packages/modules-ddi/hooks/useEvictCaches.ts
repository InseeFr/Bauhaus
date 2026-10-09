import { useMutation, useQueryClient } from "@tanstack/react-query";

import { DDIApi } from "@sdk/index";

/**
 * Vide les caches Colectica du back, puis toutes les requêtes du front : certaines (contenu des
 * listes de codes) sont gardées indéfiniment et resserviraient sinon les anciennes données.
 */
export function useEvictCaches() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (): Promise<void> => DDIApi.evictCaches(),
    onSuccess: () => queryClient.invalidateQueries(),
  });
}
