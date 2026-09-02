import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";

import { Loading, Saving } from "@components/loading";

import { Link } from "@model/concepts/concept";

import { CLOSE_MATCH } from "@sdk/constants";

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

  const { data: concept, isLoading: isLoadingConcept } = useConcept(id);

  const { save, isSaving } = useConceptSave(id);

  const [submitting, setSubmitting] = useState(false);

  const [section, setSection] = useUrlSection("general");

  useTitle(t("concept.title"), concept?.general?.prefLabelLg1);

  if (isLoadingConcept || isLoadingConcepts || !concept) {
    return <Loading />;
  }

  if (isSaving) {
    return <Saving />;
  }

  const { general, notes, links } = concept;

  const conceptsWithLinks: ConceptWithLink[] = mergeWithAllConcepts(
    concepts.map((c) => ({ id: c.id, label: c.label })),
    links ?? [],
  );

  const equivalentLinks = isCreation
    ? []
    : (links.filter((link: Link) => link.typeOfLink === CLOSE_MATCH) as (Link & { urn: string })[]);

  return (
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
    />
  );
};
