import { useQuery } from "@tanstack/react-query";
import { CollectionApi as NewCollectionApi } from "@sdk/new-collection-api";

import { PartialCollection } from "@model/concepts/collection";

export const useCollections = <T = PartialCollection[]>(
  select?: (data: PartialCollection[]) => T,
) => {
  return useQuery({
    queryKey: ["collections"],
    queryFn: (): Promise<PartialCollection[]> => {
      return NewCollectionApi.getCollectionList();
    },
    select,
  });
};
