import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";

import { Loading, Publishing } from "@components/loading";

import { ConceptsApi } from "@sdk/index";

import { useTitle } from "@utils/hooks/useTitle";

import CollectionsToValidate from "./components/CollectionsToValidate";
import { useUnpublishedCollections } from "../../../hooks/useUnpublishedCollections";

export const Component = () => {
  const { t } = useTranslation();
  useTitle(t("collection.title"), t("common.btnValid"));

  const [saving, setSaving] = useState(false);
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { data: collections = [], isLoading } = useUnpublishedCollections();

  const handleValidateCollectionList = (ids: string[]) => {
    setSaving(true);
    ConceptsApi.putCollectionValidList(ids)
      .then(() => {
        queryClient.invalidateQueries({ queryKey: ["collections"] });
        queryClient.invalidateQueries({ queryKey: ["unpublished-collections"] });
        setSaving(false);
      })
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
