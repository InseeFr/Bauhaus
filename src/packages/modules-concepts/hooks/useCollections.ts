import { useQuery } from "@tanstack/react-query";

import { CollectionApi } from "@sdk/new-collection-api";

import { PartialCollection } from "@model/concepts/collection";

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
