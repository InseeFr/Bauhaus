import { useQuery } from "@tanstack/react-query";
import { useSelector } from "react-redux";
import { OperationsApi } from "@sdk/operations-api";
import { ReduxModel } from "../../redux/model";

export const useUserSeriesList = () => {
  const stamp = useSelector((state: ReduxModel) => state.app!.auth.user.stamp);

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
