import { ClassificationsApi } from "@sdk/classification";
import { useQuery } from "@tanstack/react-query";
import { PartialClassification } from "../types";

export const useClassifications = () => {
  return useQuery<PartialClassification[]>({
    queryKey: ["classifications"],
    queryFn: ClassificationsApi.getList,
  });
};
