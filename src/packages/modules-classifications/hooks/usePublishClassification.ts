import { useMutation, useQueryClient } from "@tanstack/react-query";

import { ClassificationsApi } from "@sdk/classification";

export const usePublishClassification = (id: string) => {
  const queryClient = useQueryClient();

  const {
    isPending: isPublishing,
    mutate: publish,
    error,
  } = useMutation({
    mutationFn: () => {
      return ClassificationsApi.publishClassification(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["classifications", id] });
    },
  });

  return { isPublishing, publish, error };
};
