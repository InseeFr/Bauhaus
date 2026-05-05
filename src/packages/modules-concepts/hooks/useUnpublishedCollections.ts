import { useQuery } from "@tanstack/react-query";

import { UnpublishedCollection } from "@model/concepts/collection";

import { CollectionApi } from "@sdk/new-collection-api";

export const useUnpublishedCollections = () => {
  return useQuery<UnpublishedCollection[]>({
    queryKey: ["unpublished-collections"],
    queryFn: () => CollectionApi.getCollectionValidateList(),
  });
};
