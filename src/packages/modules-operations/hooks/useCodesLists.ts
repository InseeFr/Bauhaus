import { useQuery } from "@tanstack/react-query";

import { CodelistsApi } from "@sdk/index";

type MetadataNode = {
  codeList?: string;
  children?: Record<string, MetadataNode>;
};

const collectCodeListNotations = (tree: Record<string, MetadataNode> | undefined): string[] => {
  if (!tree) return [];

  const notations = new Set<string>();

  const visit = (node: MetadataNode) => {
    if (node.codeList) notations.add(node.codeList);
    if (node.children) Object.values(node.children).forEach(visit);
  };

  Object.values(tree).forEach(visit);

  return [...notations].sort();
};

const fetchCodeList = async (notation: string) => {
  const [codesList, codes] = await Promise.all([
    CodelistsApi.getCodesList(notation),
    CodelistsApi.getCodesListCodes(notation, 1, 0),
  ]);

  return {
    codes: codes.items ?? [],
    ...codesList,
  };
};

export const useCodesLists = (metadataStructure: Record<string, MetadataNode> | undefined) => {
  const notations = collectCodeListNotations(metadataStructure);

  const { isLoading, data: codesLists = {} } = useQuery({
    queryKey: ["operations-codes-lists", notations],
    enabled: notations.length > 0,
    queryFn: async () => {
      const results = await Promise.all(notations.map(fetchCodeList));
      return results.reduce<Record<string, Awaited<ReturnType<typeof fetchCodeList>>>>(
        (acc, codeList) => ({
          ...acc,
          [(codeList as { notation: string }).notation]: codeList,
        }),
        {},
      );
    },
  });

  return { isLoading, codesLists };
};
