import { useQuery } from "@tanstack/react-query";

import { DDIApi } from "../../sdk";
import type { CodeListItem } from "./usePhysicalCodesLists";

export const useMutualizedCodesLists = () => {
  return useQuery<CodeListItem[]>({
    queryKey: ["mutualizedCodesLists"],
    queryFn: () => DDIApi.getMutualizedCodesLists(),
  });
};
