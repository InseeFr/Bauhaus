import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router";

import { DistributionApi } from "@sdk/distributions-api";

export const useDatasetDeleter = (id: string) => {
  const queryClient = useQueryClient();

  const navigate = useNavigate();

  const {
    isPending: isDeleting,
    mutate: remove,
    error: deleteServerSideError,
  } = useMutation({
    meta: { globalErrorToast: false },
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
