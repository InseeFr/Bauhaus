import { useQuery } from "@tanstack/react-query";

import { OperationsApi } from "@sdk/operations-api";

interface UserSeries {
  id: string;
  label: string;
  altLabel: string;
  idSims?: string;
}

export const useUserSeriesList = (): {
  isLoading: boolean;
  series: UserSeries[];
} => {
  const { isLoading, data: series = [] } = useQuery<UserSeries[]>({
    queryKey: ["user-series-list"],
    queryFn: async () => {
      return OperationsApi.getUserSeriesList();
    },
    placeholderData: [],
  });

  return { isLoading, series };
};
