import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { useParams } from "react-router-dom";

import { LoadingErrorBloc } from "@components/errors-bloc";
import { Loading, Publishing } from "@components/loading";

import { ConceptsApi } from "@sdk/index";

import { useSecondLang } from "@utils/hooks/second-lang";

import { useCollection } from "../../../hooks/useCollection";
import { CollectionVisualization } from "./components/CollectionVisualization";

export const Component = () => {
  const { id } = useParams<{ id: string }>();

  const [saving, setSaving] = useState(false);

  const queryClient = useQueryClient();

  const [secondLang] = useSecondLang();

  const { data: collection, isLoading, error, refetch } = useCollection(id);

  const handleCollectionValidation = (collectionId: string) => {
    setSaving(true);
    ConceptsApi.putCollectionValidList([collectionId])
      .then(async () => {
        queryClient.invalidateQueries({ queryKey: ["collections"] });
        await refetch();
      })
      .finally(() => setSaving(false));
  };

  // Une fiche déjà affichée le reste si un rechargement échoue (après une publication, par exemple).
  if (error && !collection) {
    return <LoadingErrorBloc error={error} />;
  }

  if (isLoading || !collection) {
    return <Loading />;
  }

  if (saving) {
    return <Publishing />;
  }

  const { general, members } = collection;

  return (
    <CollectionVisualization
      id={id!}
      general={general}
      members={members}
      validateCollection={handleCollectionValidation}
      secondLang={secondLang}
    />
  );
};
