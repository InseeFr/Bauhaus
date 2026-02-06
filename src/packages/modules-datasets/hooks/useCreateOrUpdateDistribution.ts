import { Distribution } from "@model/Dataset";
import { DistributionApi } from "@sdk/distributions-api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useGoBack } from "@utils/hooks/useGoBack";

export const useCreateOrUpdateDistribution = (isEditing: boolean) => {
  const queryClient = useQueryClient();
  const goBack = useGoBack();

  const {
    isPending: isSaving,
    mutate: save,
    error: serverSideError,
  } = useMutation({
    mutationFn: (distribution: Partial<Distribution>) => {
      const promise = isEditing
        ? DistributionApi.putDistribution
        : DistributionApi.postDistribution;
      return promise(distribution).catch((e: unknown) => {
        throw e;
      });
    },
    onSuccess: (id) => {
      if (isEditing) {
        queryClient.invalidateQueries({
          queryKey: ["distributions", id],
        });
      }
      queryClient.invalidateQueries({
        queryKey: ["distributions"],
      });

      goBack(`/datasets/distributions/${id}`, !isEditing);
    },
  });

  return { isSaving, save, serverSideError };
};
