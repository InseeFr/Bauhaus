import { useQuery } from "@tanstack/react-query";

import { ClassificationsApi } from "@sdk/classification";

export const useClassification = (id: string) => {
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
