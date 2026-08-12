import { useMemo, useState } from "react";

import { pickGeographiesByUri } from "../utils/pickGeographiesByUri";

import { GeographyOption, useGeographiesOptions } from "./useGeographiesOptions";

export const useGeographies = (territory: any = {}) => {
  const { isLoading, geographiesOptions: allGeographies } = useGeographiesOptions();

  const [excludes, setExcludes] = useState(
    pickGeographiesByUri(territory?.difference ?? [], allGeographies),
  );

  const [includes, setIncludes] = useState(
    pickGeographiesByUri(territory?.unions ?? [], allGeographies),
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
