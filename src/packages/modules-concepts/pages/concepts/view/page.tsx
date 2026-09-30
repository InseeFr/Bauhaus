import { useCallback, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";

import { Loading } from "@components/loading";

import { OPEN_DOCUMENT_TEXT_MIME_TYPE } from "@sdk/constants";
import { ConceptsApi } from "@sdk/index";

import { saveFileFromHttpResponse } from "@utils/files";
import { useSecondLang } from "@utils/hooks/second-lang";

import { GlobalErrorBloc } from "../../../components/GlobalErrorBloc";
import { useConcept } from "../../../hooks/useConcept";
import { ConceptVisualization } from "./components/ConceptVisualization";
import { LoadingType } from "./components/loading";

export const Component = () => {
  const { id } = useParams<{ id: string }>();

  const navigate = useNavigate();

  const { t } = useTranslation();

  const [secondLang] = useSecondLang();

  const [operationLoading, setOperationLoading] = useState<LoadingType>();

  const [error, setError] = useState<unknown>();

  const { data: concept, isLoading, refetch } = useConcept(id);

  const loading: LoadingType = operationLoading ?? (isLoading ? "loading" : undefined);

  const handleConceptValidation = useCallback(
    (id: string) => {
      setOperationLoading("validating");
      ConceptsApi.putConceptValidList([id])
        .then(() => refetch())
        .catch((e: string) => setError(e))
        .finally(() => {
          setOperationLoading(undefined);
        });
    },
    [refetch],
  );

  const handleConceptDeletion = useCallback(() => {
    setOperationLoading("deleting");
    ConceptsApi.deleteConcept(id)
      .then(() => navigate(`/concepts`))
      .catch((e: string) => setError(e))
      .finally(() => setOperationLoading(undefined));
  }, [navigate, id]);

  const handleConceptExport = useCallback(() => {
    setOperationLoading("exporting");
    setError(undefined);
    ConceptsApi.getConceptExport(id, OPEN_DOCUMENT_TEXT_MIME_TYPE)
      .then(saveFileFromHttpResponse)
      .catch(setError)
      .finally(() => setOperationLoading(undefined));
  }, [id]);

  if (loading) {
    return <Loading />;
  }

  if (!concept) {
    return (
      <GlobalErrorBloc title={t("concept.error.title")} message={t("concept.error.notFound")} />
    );
  }

  const { general, links, notes } = concept;

  return (
    <ConceptVisualization
      id={id!}
      general={general}
      notes={notes}
      links={links}
      validateConcept={handleConceptValidation}
      deleteConcept={handleConceptDeletion}
      exportConcept={handleConceptExport}
      secondLang={secondLang}
      serverSideError={error}
    />
  );
};
