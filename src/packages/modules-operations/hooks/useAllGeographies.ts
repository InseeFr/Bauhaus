import { usePrefetchQuery, useQuery } from "@tanstack/react-query";

import { GeographieApi } from "@sdk/geographie";

export interface Geography {
  id: string;
  labelLg1: string;
  labelLg2: string;
  unions: unknown[] | null;
  difference: unknown[] | null;
  code: string;
  uri: string;
  descriptionLg1: string | null;
  descriptionLg2: string | null;
  typeTerritory: string;
  dateCreation?: string;
  dateSuppression?: string;
}

/**
 * Les territoires changent rarement et leur lecture est lente : on garde la liste cinq minutes
 * avant de la relire, et on la précharge depuis la consultation d'un rapport pour que le
 * formulaire de modification la trouve déjà en cache.
 */
const geographiesQuery = {
  queryKey: ["geographies"],
  queryFn: () => GeographieApi.getAll() as Promise<Geography[]>,
  staleTime: 5 * 60 * 1000,
};

export const useAllGeographies = (): {
  isLoading: boolean;
  geographies: Geography[];
} => {
  const { isLoading, data: geographies = [] } = useQuery<Geography[]>({
    ...geographiesQuery,
    placeholderData: [],
  });

  return { isLoading, geographies };
};

export const usePrefetchGeographies = (): void => usePrefetchQuery(geographiesQuery);
