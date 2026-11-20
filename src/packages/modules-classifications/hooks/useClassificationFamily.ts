import { queryOptions } from "@tanstack/react-query";

import { ClassificationsApi } from "@sdk/classification";

export interface FamilyGeneral {
  prefLabelLg1: string;
  [key: string]: unknown;
}

export interface FamilyMember {
  id: string;
  labelLg1: string;
  labelLg2?: string;
  [key: string]: unknown;
}

/**
 * Préfixe commun au général et aux membres d'une famille de nomenclatures. Distinct de
 * `["families"]`, pris par les familles d'opérations.
 */
const CLASSIFICATION_FAMILY_KEY = "classification-family";

/** Général d'une famille, partagé entre la page, son `loader` et les tests. */
export const familyGeneralQuery = (id: string) =>
  queryOptions<FamilyGeneral>({
    queryKey: [CLASSIFICATION_FAMILY_KEY, id, "general"],
    queryFn: async () => (await ClassificationsApi.getFamilyGeneral(id)) ?? {},
  });

/** Membres d'une famille, même usage que `familyGeneralQuery`. */
export const familyMembersQuery = (id: string) =>
  queryOptions<FamilyMember[]>({
    queryKey: [CLASSIFICATION_FAMILY_KEY, id, "members"],
    queryFn: async () => (await ClassificationsApi.getFamilyMembers(id)) ?? [],
  });
