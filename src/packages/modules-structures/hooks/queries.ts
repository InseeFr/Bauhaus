import { queryOptions } from "@tanstack/react-query";

import { Component } from "@model/structures/Component";
import { Structure } from "@model/structures/Structure";

import { CodelistsApi } from "@sdk/codelists-api";
import { StructureApi } from "@sdk/structure-api";

import { STRUCTURES_KEY } from "@utils/hooks/structures";

export interface PartialCodelist {
  uri: string;
  labelLg1: string;
  id: string;
}

/**
 * Listes de codes partielles, proposées comme représentation d'une composante. Hors du préfixe
 * `["structures"]` : elles relèvent du module listes de codes.
 */
export const partialCodelistsQuery = () =>
  queryOptions<PartialCodelist[]>({
    queryKey: ["partial-code-lists"],
    queryFn: () => CodelistsApi.getCodelistsPartial(),
  });

/** Listes partielles d'une liste de codes complète, désignée par sa notation. */
export const partialsByParentQuery = (notation: string) =>
  queryOptions<{ iri: string; labelLg1: string; id?: string }[]>({
    queryKey: [...partialCodelistsQuery().queryKey, "parent", notation],
    queryFn: () => CodelistsApi.getPartialsByParent(notation),
  });

/** Composantes mutualisées : sous `["structures"]`, l'invalidation du module les périme aussi. */
const COMPONENTS_KEY = [...STRUCTURES_KEY, "components"];

/** Fiche d'une structure. */
export const structureQuery = (id: string) =>
  queryOptions<Structure>({
    queryKey: [...STRUCTURES_KEY, id],
    queryFn: () => StructureApi.getStructure(id),
  });

/** Structures avec leurs composantes, pour la recherche avancée. */
export const structuresForSearchQuery = () =>
  queryOptions<any[]>({
    queryKey: [...STRUCTURES_KEY, "advanced-search"],
    queryFn: () => StructureApi.getStructuresForSearch(),
  });

/** Liste des composantes mutualisées. */
export const mutualizedComponentsQuery = () =>
  queryOptions<Component[]>({
    queryKey: COMPONENTS_KEY,
    queryFn: () => StructureApi.getMutualizedComponents(),
  });

/** Composantes mutualisées, pour la recherche avancée. */
export const mutualizedComponentsForSearchQuery = () =>
  queryOptions<Component[]>({
    queryKey: [...COMPONENTS_KEY, "advanced-search"],
    queryFn: () => StructureApi.getMutualizedComponentsForSearch(),
  });

/** Attributs mutualisés, proposés aux mesures. */
export const mutualizedAttributesQuery = () =>
  queryOptions<Component[]>({
    queryKey: [...COMPONENTS_KEY, "attributes"],
    queryFn: () => StructureApi.getMutualizedAttributes(),
  });

/** Fiche d'une composante mutualisée. */
export const mutualizedComponentQuery = (id: string) =>
  queryOptions<Component>({
    queryKey: [...COMPONENTS_KEY, id],
    queryFn: () => StructureApi.getMutualizedComponent(id),
  });
