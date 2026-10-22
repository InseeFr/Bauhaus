import { useEffect, useState } from "react";

import { Exporting, Loading } from "@components/loading";

import { UNPUBLISHED } from "@model/ValidationState";

import { ConceptsApi } from "@sdk/index";

import { saveFileFromHttpResponse } from "@utils/files";

import { ConceptForAdvancedSearch } from "../../../types/concept";
import { ConceptSearchList } from "./components/ConceptSearchList";

const emptyItem: ConceptForAdvancedSearch = {
  id: "",
  label: "",
  created: "",
  modified: "",
  disseminationStatus: "",
  validationState: UNPUBLISHED,
  definition: "",
  creator: "",
  isTopConceptOf: "",
  valid: "",
  altLabel: null,
};

export const Component = () => {
  const [loading, setLoading] = useState(true);

  const [conceptSearchList, setConceptSearchList] = useState<ConceptForAdvancedSearch[]>([]);

  const [exporting, setExporting] = useState(false);

  const [exportError, setExportError] = useState<unknown>();

  useEffect(() => {
    ConceptsApi.getConceptSearchList()
      .then((concepts: ConceptForAdvancedSearch[]) => {
        setConceptSearchList(concepts.map((concept) => ({ ...emptyItem, ...concept })));
      })
      .finally(() => setLoading(false));
  }, []);

  const exportHandler = (
    ids: string[],
    type: string,
    withConcepts: boolean,
    lang: "lg1" | "lg2" = "lg1",
  ) => {
    setExporting(true);
    setExportError(undefined);
    return ConceptsApi.getConceptExportZipType(ids, type, lang, withConcepts)
      .then(saveFileFromHttpResponse)
      .catch(setExportError)
      .finally(() => setExporting(false));
  };

  if (loading) {
    return <Loading />;
  }

  if (exporting) {
    return <Exporting />;
  }

  return (
    <ConceptSearchList
      conceptSearchList={conceptSearchList}
      onExport={exportHandler}
      exportError={exportError}
    />
  );
};
