import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import { Loading, Publishing } from "@components/loading";

import { ConceptsApi } from "../../../../sdk";
import { sortArrayByLabel } from "../../../../utils/array-utils";
import { useTitle } from "../../../../utils/hooks/useTitle";
import { ConceptsToValidate } from "./components/ConceptsToValidate";

interface ConceptValidateItem {
  id: string;
  label: string;
  valid?: string | null;
  validationState?: string;
}

export const Component = () => {
  const { t } = useTranslation();
  useTitle(t("concept.title"), t("common.btnValid"));
  const [loading, setLoading] = useState<boolean>(true);
  const [publishing, setPublishing] = useState<boolean>(false);
  const [concepts, setConcepts] = useState<ConceptValidateItem[]>([]);

  const loadConcepts = () =>
    ConceptsApi.getConceptValidateList().then((body: ConceptValidateItem[]) => {
      setConcepts(sortArrayByLabel(body));
    });

  const handleValidateConceptList = (ids: string[]): void => {
    setPublishing(true);
    // On reste sur la page : la liste est rechargée pour n'y laisser que les
    // concepts encore provisoires.
    ConceptsApi.putConceptValidList(ids)
      .finally(loadConcepts)
      .finally(() => setPublishing(false));
  };

  useEffect(() => {
    loadConcepts().finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (publishing) {
    return <Publishing />;
  }

  if (loading) {
    return <Loading />;
  }

  return (
    <ConceptsToValidate concepts={concepts} handleValidateConceptList={handleValidateConceptList} />
  );
};
