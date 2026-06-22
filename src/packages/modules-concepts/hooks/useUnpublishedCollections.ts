import { useQuery } from "@tanstack/react-query";

import { CollectionApi } from "@sdk/new-collection-api";

import { UnpublishedCollection } from "@model/concepts/collection";

export const useUnpublishedCollections = () => {
  return useQuery<UnpublishedCollection[]>({
    queryKey: ["unpublished-collections"],
    queryFn: () => CollectionApi.getCollectionValidateList(),
  });
};
