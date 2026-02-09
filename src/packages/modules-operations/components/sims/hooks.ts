import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";

import { GeographieApi } from "@sdk/geographie";
import { createAllDictionary } from "@utils/dictionnary";

const { D1, D2 } = createAllDictionary({
  geography: {
    labelWithStartDate: {
      en: (label: string, startDate: string) => `${label} [since ${startDate}]`,
      fr: (label: string, startDate: string) => `${label} [depuis le ${startDate}]`,
    },
    labelWithStartDateAndEndDate: {
      en: (label: string, startDate: string, endDate: string) =>
        `${label} [since ${startDate} until ${endDate}]`,
      fr: (label: string, startDate: string, endDate: string) =>
        `${label} [depuis le ${startDate} jusqu'au ${endDate}]`,
    },
  },
});

interface Geography {
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

interface GeographyOption {
  label: string;
  labelLg2: string;
  value: string;
  typeTerritory: string;
  id: string;
  geography: Geography;
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

const formatLabel = (
  label: string,
  geography: Geography,
  geographies: Geography[],
  D: typeof D1,
): string => {
  const numberOfGeographiesWithTheSameName = geographies.filter(
    (g) => g.labelLg1 === geography.labelLg1,
  ).length;

  if (numberOfGeographiesWithTheSameName > 1) {
    if (geography.dateSuppression && geography.dateCreation) {
      return D.geography.labelWithStartDateAndEndDate(
        label,
        geography.dateCreation,
        geography.dateSuppression,
      );
    } else if (geography.dateCreation) {
      return D.geography.labelWithStartDate(label, geography.dateCreation);
    }
  }
  return label;
};

export const useGeographiesOptions = (): {
  isLoading: boolean;
  geographiesOptions: GeographyOption[];
} => {
  const { isLoading, geographies } = useAllGeographies();

  const geographiesOptions = useMemo(() => {
    const geographiesSorted = geographies
      .filter(({ labelLg1 }) => labelLg1)
      .sort((g1, g2) => g1.labelLg1.toLowerCase().localeCompare(g2.labelLg1.toLowerCase()));

    return geographiesSorted.map((geography) => ({
      label: formatLabel(geography.labelLg1, geography, geographiesSorted, D1),
      labelLg2: formatLabel(geography.labelLg2, geography, geographiesSorted, D2),
      value: geography.uri,
      typeTerritory: geography.typeTerritory,
      id: geography.id,
      geography,
    }));
  }, [geographies]);

  return { isLoading, geographiesOptions };
};

export const useGeographies = (territory: any = {}) => {
  const { isLoading, geographiesOptions: allGeographies } = useGeographiesOptions();

  const [excludes, setExcludes] = useState(
    territory?.difference?.map(({ uri }: any) =>
      allGeographies.find(({ value }) => value === uri),
    ) ?? [],
  );
  const [includes, setIncludes] = useState(
    territory?.unions?.map(({ uri }: any) => allGeographies.find(({ value }) => value === uri)) ??
      [],
  );
  const geographies = useMemo(() => {
    const includesValues = includes.map(({ value }: GeographyOption) => value);
    const excludesValues = excludes.map(({ value }: GeographyOption) => value);
    const values = [...includesValues, ...excludesValues];
    return allGeographies.filter(({ value }) => !values.includes(value));
  }, [includes, excludes, allGeographies]);

  return {
    isLoading,
    geographies,
    includes,
    excludes,
    setIncludes,
    setExcludes,
    allGeographies,
  };
};
