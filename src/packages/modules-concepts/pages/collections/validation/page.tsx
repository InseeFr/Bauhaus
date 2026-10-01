import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { useTranslation } from "react-i18next";

import { Loading, Publishing } from "@components/loading";

import { ConceptsApi } from "@sdk/index";

import { formatApiErrors } from "@utils/api-errors";
import { useTitle } from "@utils/hooks/useTitle";

import { appI18n } from "../../../../i18n";
import { useUnpublishedCollections } from "../../../hooks/useUnpublishedCollections";
import { CollectionsToValidate } from "./components/CollectionsToValidate";

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
      setServerSideError(
        formatApiErrors(error, appI18n, t("collection.validation.error")).join(" "),
      );
    } finally {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["collections"] }),
        queryClient.invalidateQueries({
          queryKey: ["unpublished-collections"],
        }),
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
