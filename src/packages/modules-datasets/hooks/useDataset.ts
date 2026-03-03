import { DatasetsApi } from "@sdk/datasets-api";
import { useQuery } from "@tanstack/react-query";

export const useDataset = (id: string) => {
  return useQuery({
    enabled: !!id,
    queryKey: ["datasets", id],
    queryFn: () => DatasetsApi.getById(id),
  });
};
