import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";

import { LoadingErrorBloc } from "@components/errors-bloc";
import { Loading, Saving } from "@components/loading";

import { Link } from "@model/concepts/concept";

import { CLOSE_MATCH } from "@sdk/constants";

import { useIsDefaultContributorPending } from "@utils/creation/use-default-contributor";
import { useTitle } from "@utils/hooks/useTitle";
import { useUrlSection } from "@utils/hooks/useUrlSection";

import { useAppContext } from "../../../../application/app-context";
import { useConcept } from "../../../hooks/useConcept";
import { useConcepts } from "../../../hooks/useConcepts";
import { useConceptSave } from "../../../hooks/useConceptSave";
import { mergeWithAllConcepts } from "../../../utils/mergeWithAllConcepts";
import { ConceptEditionCreation } from "./components/ConceptEditionCreation";
import { ConceptWithLink } from "./components/LinksEdition";

export const Component = () => {
  const { t } = useTranslation();

  const { id } = useParams<{ id: string }>();

  const isCreation = !id;

  const { properties } = useAppContext();

  const maxLengthScopeNote = Number(properties.maxLengthScopeNote);

  const { concepts, isLoading: isLoadingConcepts } = useConcepts();

  const { data: concept, isLoading: isLoadingConcept, error: loadError } = useConcept(id);

  const { save, isSaving, saveError } = useConceptSave(id);

  // Le formulaire fige `general` dans son état à l'initialisation : on attend
  // que le contributeur par défaut soit résolu avant de le monter.
  const isDefaultContributorPending = useIsDefaultContributorPending();

  const [submitting, setSubmitting] = useState(false);

  const [section, setSection] = useUrlSection("general");

  useTitle(t("concept.title"), concept?.general?.prefLabelLg1);

  if (loadError && !concept) {
    return <LoadingErrorBloc error={loadError} />;
  }

  if (
    isLoadingConcept ||
    isLoadingConcepts ||
    !concept ||
    (isCreation && isDefaultContributorPending)
  ) {
    return <Loading />;
  }

  const { general, notes, links } = concept;

  const conceptsWithLinks: ConceptWithLink[] = mergeWithAllConcepts(
    concepts.map((c) => ({ id: c.id, label: c.label })),
    links ?? [],
  );

  const equivalentLinks = isCreation
    ? []
    : (links.filter((link: Link) => link.typeOfLink === CLOSE_MATCH) as (Link & { urn: string })[]);

  // Le formulaire reste monté pendant l'enregistrement : démonté, il perdrait la
  // saisie, qu'un échec doit laisser intacte.
  return (
    <>
      {isSaving && <Saving />}
      <div hidden={isSaving}>
        <ConceptEditionCreation
          id={id}
          creation={isCreation}
          title={isCreation ? t("concept.create.title") : t("concept.update.title")}
          subtitle={general?.prefLabelLg1}
          general={general}
          notes={notes}
          equivalentLinks={equivalentLinks}
          conceptsWithLinks={conceptsWithLinks}
          maxLengthScopeNote={maxLengthScopeNote}
          save={save}
          submitting={submitting}
          setSubmitting={setSubmitting}
          section={section}
          onSectionChange={setSection}
          serverSideError={saveError}
        />
      </div>
    </>
  );
};
