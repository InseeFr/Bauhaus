import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";

import { Loading, Publishing } from "@components/loading";

import { ConceptsApi } from "@sdk/index";

import { getApiErrorMessage } from "@utils/api-errors";
import { useTitle } from "@utils/hooks/useTitle";

import CollectionsToValidate from "./components/CollectionsToValidate";
import { useUnpublishedCollections } from "../../../hooks/useUnpublishedCollections";

export const Component = () => {
  const { t } = useTranslation();
  useTitle(t("collection.title"), t("common.btnValid"));

  const [saving, setSaving] = useState(false);
  const [serverSideError, setServerSideError] = useState("");
  const queryClient = useQueryClient();
  const { data: collections = [], isLoading } = useUnpublishedCollections();

  // On reste sur la page : la liste est rechargée pour n'y laisser que les
  // collections encore provisoires.
  const handleValidateCollectionList = async (ids: string[]) => {
    setSaving(true);
    setServerSideError("");
    try {
      await ConceptsApi.putCollectionValidList(ids);
    } catch (error) {
      setServerSideError(getApiErrorMessage(error, t("collection.validation.error")));
    } finally {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["collections"] }),
        queryClient.invalidateQueries({ queryKey: ["unpublished-collections"] }),
      ]);
      setSaving(false);
    }
  };

  if (saving) return <Publishing />;
  if (isLoading) return <Loading />;
  return (
    <CollectionsToValidate
      collections={collections}
      handleValidateCollectionList={handleValidateCollectionList}
      serverSideError={serverSideError}
    />
  );
};
