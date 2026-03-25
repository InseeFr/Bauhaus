import { useState } from "react";
import { useParams } from "react-router-dom";

import { Loading, Saving } from "@components/loading";

import { useTitle } from "@utils/hooks/useTitle";

import D from "../../../../deprecated-locales";
import CollectionEditionCreation from "./home";
import { useCollection } from "../../../hooks/useCollection";
import { useCollections } from "../../../hooks/useCollections";
import { useCollectionSave } from "../../../hooks/useCollectionSave";
import { useConcepts } from "../../../hooks/useConcepts";

export const Component = () => {
  const { id } = useParams();
  const isCreation = !id;

  const [submitting, setSubmitting] = useState(false);

  const { data: collection, isLoading: loadingCollection } = useCollection(id);
  const { data: collectionList } = useCollections();
  const { concepts, isLoading: isConceptLoading } = useConcepts();
  const { save, isSaving } = useCollectionSave(id);

  const { general, members } = collection || {};

  useTitle(D.collectionsTitle, general?.prefLabelLg1);

  if (isSaving) {
    return <Saving />;
  }
  if (isConceptLoading || (!isCreation && loadingCollection)) {
    return <Loading />;
  }

  return (
    <CollectionEditionCreation
      title={isCreation ? D.createCollectionTitle : D.updateCollectionTitle}
      subtitle={isCreation ? undefined : general?.prefLabelLg1}
      general={general}
      members={members}
      collectionList={collectionList}
      conceptList={concepts}
      save={save}
      submitting={submitting}
      setSubmitting={setSubmitting}
    />
  );
};
