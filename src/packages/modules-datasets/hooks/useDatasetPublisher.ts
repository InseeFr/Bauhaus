import { useMutation, useQueryClient } from "@tanstack/react-query";

import { DistributionApi } from "@sdk/distributions-api";

export const useDatasetPublisher = (id: string) => {
  const queryClient = useQueryClient();

  const {
    isPending: isPublishing,
    mutate: publish,
    error: validationServerSideError,
  } = useMutation({
    mutationFn: () => {
      return DistributionApi.publish(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["distributions", id],
      });
    },
  });

  return { isPublishing, publish, validationServerSideError };
};
