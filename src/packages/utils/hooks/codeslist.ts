import { useQueries, useQuery } from "@tanstack/react-query";

import { Code, CodesList } from "@model/CodesList";

import { CodelistsApi, fetchCodeList } from "@sdk/index";

import { sortArray } from "../array-utils";

const defaultCodesList = { codes: [] } as unknown as CodesList;
export const useCodesList = (notation: string) => {
  const { data } = useQuery<CodesList>({
    queryKey: ["codelist", notation],
    queryFn: () => fetchCodeList(notation),
  });

  return data ?? defaultCodesList;
};

export const useCodesLists = (notations: string[]) => {
  return useQueries({
    queries: notations.map((notation) => ({
      queryKey: ["codelist", notation],
      queryFn: () => fetchCodeList(notation),
    })),
  });
};

export const useAllCodes = (notation: string | undefined, enabled: boolean) => {
  return useQuery<Code[]>({
    enabled: !!notation && enabled,
    queryKey: ["codelist", notation, "codes"],
    queryFn: () =>
      CodelistsApi.getCodesListCodes(notation, 1, 0).then((codes: { items: Code[] }) => {
        return sortArray("labelLg1")(codes?.items || []);
      }),
  });
};
