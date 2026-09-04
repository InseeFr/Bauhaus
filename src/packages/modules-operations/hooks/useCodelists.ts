import { useQuery } from "@tanstack/react-query";

import { CodelistsApi } from "@sdk/index";

type MetadataNode = {
  codeList?: string;
  children?: Record<string, MetadataNode>;
};

const collectCodelistNotations = (tree: Record<string, MetadataNode> | undefined): string[] => {
  if (!tree) return [];

  const notations = new Set<string>();

  const visit = (node: MetadataNode) => {
    if (node.codeList) notations.add(node.codeList);
    if (node.children) Object.values(node.children).forEach(visit);
  };

  Object.values(tree).forEach(visit);

  return [...notations].sort();
};

const fetchCodelist = async (notation: string) => {
  const [codelist, codes] = await Promise.all([
    CodelistsApi.getCodelist(notation),
    CodelistsApi.getCodelistCodes(notation, 1, 0),
  ]);

  return {
    codes: codes.items ?? [],
    ...codelist,
  };
};

export const useCodelists = (metadataStructure: Record<string, MetadataNode> | undefined) => {
  const notations = collectCodelistNotations(metadataStructure);

  const { isLoading, data: codelists = {} } = useQuery({
    queryKey: ["operations-code-lists", notations],
    enabled: notations.length > 0,
    queryFn: async () => {
      const results = await Promise.all(notations.map(fetchCodelist));
      return results.reduce<Record<string, Awaited<ReturnType<typeof fetchCodelist>>>>(
        (acc, codelist) => ({
          ...acc,
          [(codelist as { notation: string }).notation]: codelist,
        }),
        {},
      );
    },
  });

  return { isLoading, codelists };
};
