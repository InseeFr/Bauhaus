import { useQuery } from "@tanstack/react-query";

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

export const useAllGeographies = (): {
  isLoading: boolean;
  geographies: Geography[];
} => {
  const { isLoading, data: geographies = [] } = useQuery<Geography[]>({
    queryKey: ["geographies"],
    queryFn: () => GeographieApi.getAll() as Promise<Geography[]>,
    placeholderData: [],
  });

  return { isLoading, geographies };
};
