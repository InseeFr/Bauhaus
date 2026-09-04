import { useQuery } from "@tanstack/react-query";

import { DatasetsApi } from "@sdk/datasets-api";

export const useDataset = (id: string | undefined) => {
  return useQuery({
    enabled: !!id,
    queryKey: ["datasets", id],
    queryFn: () => DatasetsApi.getById(id),
  });
};
