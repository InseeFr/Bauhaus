import { useQuery } from "@tanstack/react-query";

import { OperationsApi } from "@sdk/operations-api";

import { getTree } from "../utils/msd";

export const useMetadataStructure = () => {
  const { isLoading, data: metadataStructure = {} } = useQuery({
    queryKey: ["metadata-structure"],
    queryFn: async () => {
      const [metaDataStructure, metadataAttributes] = await Promise.all([
        OperationsApi.getMetadataStructureList(),
        OperationsApi.getMetadataAttributesList(),
      ]);

      const metadataAttributesObject = metadataAttributes.reduce(
        (acc: Record<string, unknown>, attr: { id: string }) => {
          return {
            ...acc,
            [attr.id]: {
              ...attr,
            },
          };
        },
        {},
      );

      return getTree(metaDataStructure, undefined, metadataAttributesObject);
    },
  });

  return { isLoading, metadataStructure };
};
