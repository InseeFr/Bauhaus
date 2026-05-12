import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

import { Loading, Publishing } from "@components/loading";

import { OK, PENDING } from "@sdk/constants";

import { ConceptsApi } from "../../../../sdk";
import { sortArrayByLabel } from "../../../../utils/array-utils";
import { useTitle } from "../../../../utils/hooks/useTitle";
import ConceptsToValidate from "./components/home";

type ExportingStatus = typeof OK | typeof PENDING | undefined;

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
  const [exporting, setExporting] = useState<ExportingStatus>();
  const [concepts, setConcepts] = useState<ConceptValidateItem[]>([]);

  const handleValidateConceptList = (ids: string[]): void => {
    setExporting(PENDING);
    ConceptsApi.putConceptValidList(ids).finally(() => setExporting(OK));
  };

  useEffect(() => {
    ConceptsApi.getConceptValidateList()
      .then((body: ConceptValidateItem[]) => {
        setConcepts(sortArrayByLabel(body));
      })
      .finally(() => setLoading(false));
  }, []);

  if (exporting === OK) {
    return <Navigate to="/concepts" replace />;
  }

  if (exporting === PENDING) {
    return <Publishing />;
  }

  if (loading) {
    return <Loading />;
  }

  return (
    <ConceptsToValidate concepts={concepts} handleValidateConceptList={handleValidateConceptList} />
  );
};
