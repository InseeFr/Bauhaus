import { useQuery } from "@tanstack/react-query";

import { DatasetsApi } from "@sdk/datasets-api";

export const useDatasets = () => {
  return useQuery({
    queryFn: () => DatasetsApi.getAll(),
    queryKey: ["datasets"],
  });
};
