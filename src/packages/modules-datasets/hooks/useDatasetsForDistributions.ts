import { DistributionApi } from "@sdk/distributions-api";
import { useQuery } from "@tanstack/react-query";

export const useDatasetsForDistributions = () => {
  return useQuery({
    queryFn: () => DistributionApi.getDatasets(),
    queryKey: ["datasets-distributions"],
  });
};
