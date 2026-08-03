import { useMutation, useQueryClient } from "@tanstack/react-query";
import { DDIApi } from "../../sdk";
import type { PhysicalInstanceParents } from "./usePhysicalInstanceParents";

interface PublishPhysicalInstanceParams {
  id: string;
  agencyId: string;
  data: unknown;
}

export function usePublishPhysicalInstance() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, agencyId, data }: PublishPhysicalInstanceParams) =>
      DDIApi.putPhysicalInstance(agencyId, id, data),
    onSuccess: (_, variables) => {
      // Invalider le cache pour rafraîchir les données
      queryClient.invalidateQueries({
        queryKey: ["physicalInstanceById", variables.agencyId, variables.id],
      });
      // Le PUT stampe un nouveau versionDate, affiché par la liste de la home et la
      // recherche avancée : sans éviction (staleTime: Infinity), elles resteraient
      // périmées jusqu'au F5.
      queryClient.invalidateQueries({ queryKey: ["physicalInstances"] });
      queryClient.invalidateQueries({ queryKey: ["physicalInstancesSearch"] });
      // Invalider le cache des code lists pour qu'elles soient disponibles
      // immédiatement dans le sélecteur "Réutiliser une code list"
      queryClient.invalidateQueries({
        queryKey: ["physicalCodesLists", variables.agencyId, variables.id],
      });
      // L'enregistrement crée/supprime des variables qui référencent des listes de codes : les
      // utilisations de N'IMPORTE QUELLE liste ont pu changer, on évince donc tout le préfixe.
      // Sans cela (staleTime: Infinity), `useCodeListUsers` resterait sur son résultat périmé et la
      // confirmation de surcharge d'une liste devenue partagée n'apparaîtrait qu'après un F5.
      queryClient.invalidateQueries({ queryKey: ["codeListUsers"] });
      // Une nouvelle liste de codes est rattachée au LogicalProduct du groupe parent :
      // invalider les listes du groupe (et non les mutualisées) pour les voir sans hard refresh.
      // Le groupe parent est déjà en cache via usePhysicalInstanceParents.
      const parents = queryClient.getQueryData<PhysicalInstanceParents>([
        "physicalInstanceParents",
        variables.agencyId,
        variables.id,
      ]);
      if (parents?.group) {
        queryClient.invalidateQueries({
          queryKey: ["groupCodesLists", parents.group.agency, parents.group.id],
        });
      }
    },
  });
}
