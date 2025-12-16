import { useState, useMemo } from "react";
import { useSelector } from "react-redux";

import { getAllOptions } from "../../../redux/geographies.action";

export const useGeographies = (territory: any = {}) => {
  const allGeographies = useSelector(getAllOptions);

  const [excludes, setExcludes] = useState(
    territory?.difference?.map(({ uri }: any) =>
      allGeographies.find(({ value }: any) => value === uri),
    ) ?? [],
  );
  const [includes, setIncludes] = useState(
    territory?.unions?.map(({ uri }: any) =>
      allGeographies.find(({ value }: any) => value === uri),
    ) ?? [],
  );
  const geographies = useMemo(() => {
    const includesValues = includes.map(({ value }: any) => value);
    const excludesValues = excludes.map(({ value }: any) => value);
    const values = [...includesValues, ...excludesValues];
    return allGeographies.filter(({ value }) => !values.includes(value));
  }, [includes, excludes, allGeographies]);

  return [geographies, includes, excludes, setIncludes, setExcludes, allGeographies];
};
