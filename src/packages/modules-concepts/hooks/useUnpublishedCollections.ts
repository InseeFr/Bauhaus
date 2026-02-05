import { useQuery } from "@tanstack/react-query";

import { UnpublishedCollection } from "@model/concepts/collection";

import { ConceptsApi } from "@sdk/index";

export const useUnpublishedCollections = () => {
  return useQuery<UnpublishedCollection[]>({
    queryKey: ["unpublished-collections"],
    queryFn: () => ConceptsApi.getCollectionValidateList(),
  });
};
