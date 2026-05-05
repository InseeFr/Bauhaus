import { useCallback, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";

import { Loading } from "@components/loading";

import { ConceptsApi } from "@sdk/index";

import { useSecondLang } from "@utils/hooks/second-lang";
import { useLocales } from "@utils/hooks/useLocales";

import ConceptVisualization from "./home";
import { LoadingProvider, LoadingType } from "./loading";
import { useConcept } from "../../../hooks/useConcept";
import { GlobalErrorBloc } from "../../../components/GlobalErrorBloc";

export const Component = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const langs = useLocales();
  const [secondLang] = useSecondLang();

  const [operationLoading, setOperationLoading] = useState<LoadingType>();
  const [error, setError] = useState<string | undefined>();

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

  console.log(isLoading, operationLoading);
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
    <LoadingProvider value={{ loading, setLoading: setOperationLoading }}>
      <ConceptVisualization
        id={id}
        general={general}
        notes={notes}
        links={links}
        validateConcept={handleConceptValidation}
        deleteConcept={handleConceptDeletion}
        secondLang={secondLang}
        langs={langs}
        serverSideError={error}
      />
    </LoadingProvider>
  );
};
