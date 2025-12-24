import { useQuery } from "@tanstack/react-query";

import { OperationsApi } from "@sdk/operations-api";
import { useUserStamps } from "@utils/hooks/users";

export const useUserSeriesList = () => {
  const { data: userStamps = [] } = useUserStamps();
  const stamp = userStamps[0]?.stamp;

  const { isLoading, data: series } = useQuery({
    queryKey: ["user-series-list", stamp],
    queryFn: async () => {
      return OperationsApi.getUserSeriesList(stamp);
    },
    enabled: !!stamp,
    placeholderData: [],
  });

  return { isLoading, series };
};
