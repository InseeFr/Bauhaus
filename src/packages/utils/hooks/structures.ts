import { queryOptions, useQuery } from "@tanstack/react-query";

import { StructuresList } from "@model/structures/Structure";

import { StructureApi } from "@sdk/index";

/**
 * Préfixe commun à toutes les lectures du module structures (liste, recherche, fiches, composantes
 * mutualisées) : l'invalider périme l'ensemble.
 */
export const STRUCTURES_KEY = ["structures"];

/** Liste des structures, partagée entre la page d'accueil du module et les jeux de données. */
export const structuresQuery = () =>
  queryOptions<StructuresList>({
    queryKey: STRUCTURES_KEY,
    queryFn: () => StructureApi.getStructures(),
  });

export const useStructures = () => useQuery(structuresQuery());
