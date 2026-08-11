import { useMemo } from "react";

import { createAllDictionary } from "@utils/dictionnary";

import { Geography, useAllGeographies } from "./useAllGeographies";

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

export interface GeographyOption {
  label: string;
  labelLg2: string;
  value: string;
  typeTerritory: string;
  id: string;
  geography: Geography;
}

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
