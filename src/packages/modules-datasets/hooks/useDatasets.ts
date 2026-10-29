import { useQuery } from "@tanstack/react-query";

import { PartialDataset } from "@model/Dataset";

import { DatasetsApi } from "@sdk/datasets-api";

export const useDatasets = () => {
  return useQuery<PartialDataset[]>({
    queryFn: () => DatasetsApi.getAll(),
    queryKey: ["datasets"],
  });
};
