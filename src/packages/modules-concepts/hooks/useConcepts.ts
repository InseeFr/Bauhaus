import { useEffect, useState } from "react";

import { PartialConcept } from "@model/concepts/concept";

import { ConceptApi } from "@sdk/new-concept-api";

import { sortArrayByLabel } from "@utils/array-utils";

export const useConcepts = () => {
  const [concepts, setConcepts] = useState<PartialConcept[]>([]);

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    ConceptApi.getConceptList()
      .then((list) => setConcepts(sortArrayByLabel(list)))
      .finally(() => setIsLoading(false));
  }, []);

  return { concepts, isLoading };
};
