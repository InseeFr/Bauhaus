import { useQuery } from "@tanstack/react-query";

import { ClassificationsApi } from "@sdk/classification";

import { PartialClassification } from "../types";

export const useClassifications = () => {
  return useQuery<PartialClassification[]>({
    queryKey: ["classifications"],
    queryFn: ClassificationsApi.getList,
  });
};
