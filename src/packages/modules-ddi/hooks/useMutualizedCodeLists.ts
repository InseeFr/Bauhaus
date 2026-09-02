import { useQuery } from "@tanstack/react-query";

import { DDIApi } from "@sdk/index";

import type { CodeListItem } from "./usePhysicalCodeLists";

export const useMutualizedCodeLists = () => {
  return useQuery<CodeListItem[]>({
    queryKey: ["mutualizedCodeLists"],
    queryFn: () => DDIApi.getMutualizedCodeLists(),
  });
};
