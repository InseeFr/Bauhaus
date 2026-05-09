import { useState } from "react";
import { useParams } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";

import { Loading, Publishing } from "@components/loading";

import { ConceptsApi } from "@sdk/index";

import { useSecondLang } from "@utils/hooks/second-lang";

import { Collection } from "../../../../model/concepts/collection";
import { useCollection } from "../../../hooks/useCollection";
import CollectionVisualization from "./components/home";

interface CollectionWithMembers {
  general: Collection;
  members: { id: string; prefLabelLg1?: string; prefLabelLg2?: string }[];
}

export const Component = () => {
  const { id } = useParams<{ id: string }>();
  const [saving, setSaving] = useState(false);
  const queryClient = useQueryClient();

  const [secondLang] = useSecondLang();

  const { data: collection, isLoading, refetch } = useCollection(id);

  const handleCollectionValidation = (collectionId: string) => {
    setSaving(true);
    ConceptsApi.putCollectionValidList([collectionId])
      .then(async () => {
        queryClient.invalidateQueries({ queryKey: ["collections"] });
        await refetch();
      })
      .finally(() => setSaving(false));
  };

  if (isLoading || !collection) {
    return <Loading />;
  }

  if (saving) {
    return <Publishing />;
  }
  const { general, members } = collection as unknown as CollectionWithMembers;

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
