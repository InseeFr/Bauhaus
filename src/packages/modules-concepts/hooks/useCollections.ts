import { useQuery } from "@tanstack/react-query";

import { PartialCollection } from "@model/concepts/collection";

import { CollectionApi } from "@sdk/new-collection-api";

export const useCollections = <T = PartialCollection[]>(
  select?: (data: PartialCollection[]) => T,
) => {
  return useQuery({
    queryKey: ["collections"],
    queryFn: (): Promise<PartialCollection[]> => CollectionApi.getCollectionList(),
    select,
    placeholderData: [],
  });
};
