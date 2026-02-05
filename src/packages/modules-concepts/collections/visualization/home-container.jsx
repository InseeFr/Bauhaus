import { useState } from "react";
import { useParams } from "react-router-dom";

import { Loading, Publishing } from "@components/loading";

import { ConceptsApi } from "@sdk/index";

import { useSecondLang } from "@utils/hooks/second-lang";

import CollectionVisualization from "./home";
import { useCollection } from "../../hooks/useCollection";

export const Component = () => {
  const { id } = useParams();
  const [saving, setSaving] = useState(false);

  const [secondLang] = useSecondLang();

  const { data: collection, isLoading, refetch } = useCollection(id);

  const handleCollectionValidation = (id) => {
    setSaving(true);
    ConceptsApi.putCollectionValidList([id])
      .then(() => refetch())
      .finally(() => setSaving(false));
  };

  if (isLoading) {
    return <Loading />;
  }

  if (saving) {
    return <Publishing />;
  }
  const { general, members } = collection;

  return (
    <CollectionVisualization
      id={id}
      general={general}
      members={members}
      validateCollection={handleCollectionValidation}
      secondLang={secondLang}
    />
  );
};
