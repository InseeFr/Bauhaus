import { ConceptsApi } from "@sdk/concepts-api";
import { useEffect, useState } from "react";
import type { Concept } from "../types/concept";
import { sortArrayByLabel } from "@utils/array-utils";

export const useConcepts = () => {
  const [concepts, setConcepts] = useState<Concept[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    ConceptsApi.getConceptList()
      .then((list: Concept[]) => setConcepts(sortArrayByLabel(list)))
      .finally(() => setIsLoading(false));
  }, []);

  return { concepts, isLoading };
};
