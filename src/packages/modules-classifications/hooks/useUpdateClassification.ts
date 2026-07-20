import { useMutation, useQueryClient } from "@tanstack/react-query";

import { ClassificationsApi } from "@sdk/classification";

import { ClassificationWithLevels } from "../types";

export const useUpdateClassification = (id: string) => {
  const queryClient = useQueryClient();
  const {
    isPending: isSaving,
    mutate: save,
    error,
    isSuccess: isSavingSuccess,
    status,
  } = useMutation({
    mutationFn: (classification: ClassificationWithLevels) => {
      return ClassificationsApi.putClassification(classification.general);
    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["classifications", id] });
    },
  });
  return { isSaving, save, error, isSavingSuccess, status };
};
