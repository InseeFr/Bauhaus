import { useQuery } from "@tanstack/react-query";

import { ConceptApi } from "@sdk/new-concept-api";

import { UnpublishedConcept } from "@model/concepts/concept";

export const useUnpublishedConcepts = () => {
  return useQuery<UnpublishedConcept[]>({
    queryKey: ["unpublished-concepts"],
    queryFn: () => ConceptApi.getConceptValidateList(),
  });
};
