import { useQueries, useQuery } from "@tanstack/react-query";

import { Code, Codelist } from "@model/Codelist";

import { CodelistsApi, fetchCodelist } from "@sdk/index";

import { sortArray } from "../array-utils";

const defaultCodelist = { codes: [] } as unknown as Codelist;
export const useCodelist = (notation: string) => {
  const { data } = useQuery<Codelist>({
    queryKey: ["codelist", notation],
    queryFn: () => fetchCodelist(notation),
  });

  return data ?? defaultCodelist;
};

export const useCodelists = (notations: string[]) => {
  return useQueries({
    queries: notations.map((notation) => ({
      queryKey: ["codelist", notation],
      queryFn: () => fetchCodelist(notation),
    })),
  });
};

export const useAllCodes = (notation: string | undefined, enabled: boolean) => {
  return useQuery<Code[]>({
    enabled: !!notation && enabled,
    queryKey: ["codelist", notation, "codes"],
    queryFn: () =>
      CodelistsApi.getCodelistCodes(notation, 1, 0).then((codes: { items: Code[] }) => {
        return sortArray("labelLg1")(codes?.items || []);
      }),
  });
};
