import { useState } from "react";
import { useParams } from "react-router-dom";

import { Loading, Saving } from "@components/loading";

import { CLOSE_MATCH } from "@sdk/constants";

import { useAppContext } from "../../../../application/app-context";
import D from "../../../../deprecated-locales";
import { Link } from "../../../../model/concepts/concept";
import { useTitle } from "../../../../utils/hooks/useTitle";
import { useConcept } from "../../../hooks/useConcept";
import { useConcepts } from "../../../hooks/useConcepts";
import { useConceptSave } from "../../../hooks/useConceptSave";
import { mergeWithAllConcepts } from "../../../utils/links";
import ConceptEditionCreation from "./components/home";
import { ConceptWithLink } from "./components/links";

export const Component = () => {
  const { id } = useParams<{ id: string }>();
  const isCreation = !id;

  const { properties } = useAppContext();
  const maxLengthScopeNote = Number(properties.maxLengthScopeNote);

  const { concepts, isLoading: isLoadingConcepts } = useConcepts();
  const { data: concept, isLoading: isLoadingConcept } = useConcept(id);

  const { save, isSaving } = useConceptSave(id);
  const [submitting, setSubmitting] = useState(false);

  useTitle(D.conceptsTitle, concept?.general?.prefLabelLg1);

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
      title={isCreation ? D.createConceptTitle : D.updateConceptTitle}
      subtitle={general?.prefLabelLg1}
      general={general}
      notes={notes}
      equivalentLinks={equivalentLinks}
      conceptsWithLinks={conceptsWithLinks}
      maxLengthScopeNote={maxLengthScopeNote}
      save={save}
      submitting={submitting}
      setSubmitting={setSubmitting}
    />
  );
};
