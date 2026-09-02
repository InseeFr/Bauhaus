import { useQuery } from "@tanstack/react-query";

import { DDIApi } from "@sdk/index";

import type { CodeListItem } from "./usePhysicalCodesLists";

export const useMutualizedCodesLists = () => {
  return useQuery<CodeListItem[]>({
    queryKey: ["mutualizedCodesLists"],
    queryFn: () => DDIApi.getMutualizedCodesLists(),
  });
};
