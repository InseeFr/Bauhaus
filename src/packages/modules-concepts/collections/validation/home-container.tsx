import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { Loading, Publishing } from "@components/loading";

import { ConceptsApi } from "@sdk/index";

import { useTitle } from "@utils/hooks/useTitle";

import D from "../../../deprecated-locales";
import CollectionsToValidate from "./home";
import { useUnpublishedCollections } from "../../hooks/useUnpublishedCollections";

export const Component = () => {
  useTitle(D.collectionsTitle, D.btnValid);

  const [saving, setSaving] = useState(false);
  const navigate = useNavigate();
  const { data: collections = [], isLoading } = useUnpublishedCollections();

  const handleValidateCollectionList = (ids: string[]) => {
    setSaving(true);
    ConceptsApi.putCollectionValidList(ids)
      .then(() => setSaving(false))
      .finally(() => navigate("/concepts/collections"));
  };

  if (saving) return <Publishing />;
  if (isLoading) return <Loading />;
  return (
    <CollectionsToValidate
      collections={collections}
      handleValidateCollectionList={handleValidateCollectionList}
    />
  );
};
