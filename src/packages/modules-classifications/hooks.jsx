import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { ClassificationsApi } from "@sdk/classification";

export const useSeries = () => {
  const { isLoading, data: series } = useQuery({
    queryKey: ["classifications-series"],
    queryFn: () => {
      return ClassificationsApi.getSeriesList();
    },
  });

  return { isLoading, series };
};

export const useClassifications = () => {
  const { isLoading, data: classifications } = useQuery({
    queryKey: ["classifications"],
    queryFn: ClassificationsApi.getList,
  });

  return { isLoading, classifications };
};

export const useClassification = (id) => {
  const {
    isLoading,
    status,
    data: classification,
  } = useQuery({
    queryKey: ["classifications", id],
    queryFn: () => {
      return Promise.all([
        ClassificationsApi.getClassificationGeneral(id),
        ClassificationsApi.getClassificationLevels(id),
      ]).then(([general, levels]) => {
        return { general, levels };
      });
    },
  });

  return { isLoading, classification, status };
};
export const usePublishClassification = (id) => {
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
      queryClient.invalidateQueries(["classifications", id]);
    },
  });
  return { isPublishing, publish, error };
};

export const useUpdateClassification = (id) => {
  const queryClient = useQueryClient();
  const {
    isPending: isSaving,
    mutate: save,
    error,
    isSuccess: isSavingSuccess,
    status,
  } = useMutation({
    mutationFn: (classification) => {
      return ClassificationsApi.putClassification(classification.general);
    },

    onSuccess: () => {
      queryClient.invalidateQueries(["classifications", id]);
    },
  });
  return { isSaving, save, error, isSavingSuccess, status };
};
