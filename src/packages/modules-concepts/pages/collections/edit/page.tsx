import { useState } from "react";
import { useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";

import { Loading, Saving } from "@components/loading";

import { useTitle } from "@utils/hooks/useTitle";

import { CollectionWithMembers } from "@model/concepts/collection";

import { useCollection } from "../../../hooks/useCollection";
import { useCollections } from "../../../hooks/useCollections";
import { useCollectionSave } from "../../../hooks/useCollectionSave";
import { useConcepts } from "../../../hooks/useConcepts";
import { CollectionEditionCreation } from "./components/CollectionEditionCreation";

export const Component = () => {
  const { t } = useTranslation();

  const { id } = useParams<{ id: string }>();

  const isCreation = !id;

  const [submitting, setSubmitting] = useState(false);

  const { data: collection, isLoading: loadingCollection } = useCollection(id);

  const { data: collectionList = [] } = useCollections();

  const { concepts, isLoading: isConceptLoading } = useConcepts();

  const { save, isSaving } = useCollectionSave(id);

  const { general, members = [] } = (collection ?? {}) as Partial<CollectionWithMembers>;

  useTitle(t("collection.title"), general?.prefLabelLg1);

  if (isSaving) {
    return <Saving />;
  }

  if (isConceptLoading || (!isCreation && loadingCollection) || !general) {
    return <Loading />;
  }

  return (
    <CollectionEditionCreation
      title={isCreation ? t("collection.create.title") : t("collection.update.title")}
      subtitle={isCreation ? undefined : general?.prefLabelLg1}
      creation={isCreation}
      general={general}
      members={members}
      collectionList={collectionList}
      conceptList={concepts.map((c) => ({ id: c.id, label: c.label }))}
      save={save}
      submitting={submitting}
      setSubmitting={setSubmitting}
    />
  );
};
