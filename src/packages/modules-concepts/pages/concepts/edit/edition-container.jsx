import { useState } from "react";
import { useParams } from "react-router-dom";

import { Loading, Saving } from "@components/loading";

import { CLOSE_MATCH } from "@sdk/constants";

import { useAppContext } from "../../../../application/app-context";
import D from "../../../../deprecated-locales";
import { useTitle } from "../../../../utils/hooks/useTitle";
import { useConcept } from "../../../hooks/useConcept";
import { useConcepts } from "../../../hooks/useConcepts";
import { useConceptSave } from "../../../hooks/useConceptSave";
import { mergeWithAllConcepts } from "../../../utils/links";
import ConceptEditionCreation from "./home";

export const Component = () => {
  const { id } = useParams();
  const isCreation = !id;

  const { properties } = useAppContext();
  const maxLengthScopeNote = Number(properties.maxLengthScopeNote);

  const { concepts, isLoading: isLoadingConcepts } = useConcepts();
  const { data: concept, isLoading: isLoadingConcept } = useConcept(id);

  const { save, isSaving } = useConceptSave(id);
  const [submitting, setSubmitting] = useState(false);

  useTitle(D.conceptsTitle, concept?.general?.prefLabelLg1);

  if (isLoadingConcept || isLoadingConcepts) {
    return <Loading />;
  }

  if (isSaving) {
    return <Saving />;
  }

  const { general, notes, links } = concept;

  const conceptsWithLinks = mergeWithAllConcepts(concepts, links ?? []);

  return (
    <ConceptEditionCreation
      id={id}
      creation={isCreation}
      title={isCreation ? D.createConceptTitle : D.updateConceptTitle}
      subtitle={general?.prefLabelLg1}
      general={general}
      notes={notes}
      equivalentLinks={
        isCreation ? [] : concept.links.filter((link) => link.typeOfLink === CLOSE_MATCH)
      }
      conceptsWithLinks={conceptsWithLinks}
      maxLengthScopeNote={maxLengthScopeNote}
      save={save}
      submitting={submitting}
      setSubmitting={setSubmitting}
    />
  );
};
