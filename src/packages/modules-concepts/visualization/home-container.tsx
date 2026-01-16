import { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";

import { Loading } from "@components/loading";

import { ConceptsApi } from "@sdk/index";

import { GlobalErrorBloc } from "../components/GlobalErrorBloc";

import { useSecondLang } from "@utils/hooks/second-lang";
import { useLocales } from "@utils/hooks/useLocales";
import { rmesHtmlToRawHtml } from "@utils/html-utils";

import { Concept, ConceptGeneral, ConceptNotes } from "../../model/concepts/concept";
import { emptyNotes } from "../utils/notes";
import ConceptVisualization from "./home";
import { LoadingProvider, LoadingType } from "./loading";

const formatNotes = (notes: ConceptNotes) => {
  const keys = Object.keys(notes) as unknown as (keyof ConceptNotes)[];
  return {
    ...emptyNotes,
    ...keys.reduce((formatted: ConceptNotes, noteName) => {
      formatted[noteName] = rmesHtmlToRawHtml(notes[noteName]!);
      return formatted;
    }, {} as ConceptNotes),
  };
};
export const Component = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const langs = useLocales();
  const [secondLang] = useSecondLang();

  const [loading, setLoading] = useState<LoadingType>("loading");
  const [concept, setConcept] = useState<Concept>();
  const [error, setError] = useState<string | undefined>();

  const fetchConcept = (id: string) => {
    return ConceptsApi.getConceptGeneral(id)
      .then((general: ConceptGeneral) => {
        const { conceptVersion } = general;
        return Promise.all([
          ConceptsApi.getNoteVersionList(id, conceptVersion),
          ConceptsApi.getConceptLinkList(id),
        ]).then(([notes, links]) => {
          setConcept({
            general,
            notes: formatNotes(notes),
            links,
          });
        });
      })
      .finally(() => setLoading(undefined));
  };
  useEffect(() => {
    fetchConcept(id!);
  }, [id]);

  const handleConceptValidation = useCallback((id: string) => {
    setLoading("validating");

    ConceptsApi.putConceptValidList([id])
      .then(() => fetchConcept(id))
      .catch((e: string) => setError(e))
      .finally(() => {
        setLoading(undefined);
      });
  }, []);

  const handleConceptDeletion = useCallback(() => {
    setLoading("deleting");
    ConceptsApi.deleteConcept(id)
      .then(() => navigate(`/concepts`))
      .catch((e: string) => setError(e))
      .finally(() => setLoading(undefined));
  }, [navigate, id]);

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
    <LoadingProvider value={{ loading, setLoading }}>
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
