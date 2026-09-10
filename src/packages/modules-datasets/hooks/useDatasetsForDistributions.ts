import { useQuery } from "@tanstack/react-query";

import { DistributionApi } from "@sdk/distributions-api";

export const useDatasetsForDistributions = () => {
  return useQuery({
    queryFn: () => DistributionApi.getDatasets(),
    queryKey: ["datasets-distributions"],
  });
};
