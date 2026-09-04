import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";

import { DistributionApi } from "@sdk/distributions-api";

export const useDatasetDeleter = (id: string) => {
  const queryClient = useQueryClient();

  const navigate = useNavigate();

  const {
    isPending: isDeleting,
    mutate: remove,
    error: deleteServerSideError,
  } = useMutation({
    mutationFn: () => {
      return DistributionApi.deleteDistribution(id);
    },
    onSuccess: (id) => {
      return Promise.all([
        queryClient.removeQueries({ queryKey: ["distributions", id] }),
        queryClient.invalidateQueries({ queryKey: ["distributions"] }),
      ]).then(() => navigate("/datasets/distributions"));
    },
  });

  return { isDeleting, remove, deleteServerSideError };
};
