import { useQuery } from "@tanstack/react-query";

import { PartialClassificationSerie } from "@model/Classification";

import { ClassificationsApi } from "@sdk/classification";

export const useClassificationSeries = () => {
  const { isLoading, data: series } = useQuery<PartialClassificationSerie[]>({
    queryKey: ["classifications-series"],
    queryFn: () => {
      return ClassificationsApi.getSeriesList();
    },
  });

  return { isLoading, series };
};
