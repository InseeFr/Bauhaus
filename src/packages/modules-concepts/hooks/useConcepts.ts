import { useEffect, useState } from "react";

import { ConceptApi as NewConceptApi } from "@sdk/new-concept-api";

import { PartialConcept } from "@model/concepts/concept";

import { sortArrayByLabel } from "@utils/array-utils";

export const useConcepts = () => {
  const [concepts, setConcepts] = useState<PartialConcept[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    NewConceptApi.getConceptList()
      .then((list) => setConcepts(sortArrayByLabel(list)))
      .finally(() => setIsLoading(false));
  }, []);

  return { concepts, isLoading };
};
