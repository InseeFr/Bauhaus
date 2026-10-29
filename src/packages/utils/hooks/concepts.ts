import { queryOptions } from "@tanstack/react-query";

import { PartialConcept } from "@model/concepts/concept";

import { ConceptsApi } from "@sdk/concepts-api";

/**
 * Liste des concepts, lue par plusieurs modules (structures, concepts). La clé `["concepts"]` est
 * celle que `useConceptSave` invalide : une sauvegarde de concept périme cette liste.
 */
export const conceptListQuery = () =>
  queryOptions<PartialConcept[]>({
    queryKey: ["concepts"],
    queryFn: () => ConceptsApi.getConceptList(),
  });
