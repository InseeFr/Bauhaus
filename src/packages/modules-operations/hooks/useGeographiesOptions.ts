import i18next from "i18next";
import { useMemo } from "react";

import { Geography, useAllGeographies } from "./useAllGeographies";

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
  lng: "fr" | "en",
): string => {
  const numberOfGeographiesWithTheSameName = geographies.filter(
    (g) => g.labelLg1 === geography.labelLg1,
  ).length;

  if (numberOfGeographiesWithTheSameName > 1) {
    if (geography.dateSuppression && geography.dateCreation) {
      return i18next.t("geography.labelWithStartDateAndEndDate", {
        lng,
        label,
        startDate: geography.dateCreation,
        endDate: geography.dateSuppression,
      });
    } else if (geography.dateCreation) {
      return i18next.t("geography.labelWithStartDate", {
        lng,
        label,
        startDate: geography.dateCreation,
      });
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
      label: formatLabel(geography.labelLg1, geography, geographiesSorted, "fr"),
      labelLg2: formatLabel(geography.labelLg2, geography, geographiesSorted, "en"),
      value: geography.uri,
      typeTerritory: geography.typeTerritory,
      id: geography.id,
      geography,
    }));
  }, [geographies]);

  return { isLoading, geographiesOptions };
};
