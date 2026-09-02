import { useQuery } from "@tanstack/react-query";

import { UnpublishedConcept } from "@model/concepts/concept";

import { ConceptApi } from "@sdk/new-concept-api";

export const useUnpublishedConcepts = () => {
  return useQuery<UnpublishedConcept[]>({
    queryKey: ["unpublished-concepts"],
    queryFn: () => ConceptApi.getConceptValidateList(),
  });
};
