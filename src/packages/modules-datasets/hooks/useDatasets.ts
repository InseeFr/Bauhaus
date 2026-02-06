import { DatasetsApi } from "@sdk/datasets-api";
import { useQuery } from "@tanstack/react-query";

export const useDatasets = () => {
  return useQuery({
    queryFn: () => DatasetsApi.getAll(),
    queryKey: ["datasets"],
  });
};
