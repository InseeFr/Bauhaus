import { useQuery } from "@tanstack/react-query";

import { DDIApi } from "@sdk/index";

import type { CodeListItem } from "./usePhysicalCodeLists";

export const useMutualizedCodeLists = () => {
  return useQuery<CodeListItem[]>({
    queryKey: ["mutualizedCodeLists"],
    // Lecture lourde de Colectica : en cache jusqu'à son éviction après une sauvegarde.
    staleTime: Infinity,
    queryFn: () => DDIApi.getMutualizedCodeLists(),
  });
};
